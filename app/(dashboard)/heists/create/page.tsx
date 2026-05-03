'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { addDoc, getDocs, collection, serverTimestamp, Timestamp } from 'firebase/firestore'
import { useUser } from '@/context/AuthContext'
import { db, heistsCollection } from '@/lib/firestore'
import { COLLECTIONS } from '@/types/firestore'
import styles from './page.module.css'

interface UserOption {
  uid: string
  codename: string
}

export default function CreateHeistPage() {
  const { user } = useUser()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedToUid, setAssignedToUid] = useState('')
  const [users, setUsers] = useState<UserOption[]>([])
  const [usersLoading, setUsersLoading] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    async function fetchUsers() {
      try {
        const snapshot = await getDocs(collection(db, COLLECTIONS.USERS))
        const options: UserOption[] = snapshot.docs
          .map((doc) => {
            const data = doc.data()
            return {
              uid: data.uid as string,
              codename: (data.codename ?? data.email ?? data.uid) as string,
            }
          })
          .filter((u) => u.uid !== user?.uid)
        setUsers(options)
        if (options.length > 0) setAssignedToUid(options[0].uid)
      } finally {
        setUsersLoading(false)
      }
    }
    fetchUsers()
  }, [user?.uid])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim() || !user) return

    const assignee = users.find((u) => u.uid === assignedToUid)

    setIsLoading(true)
    setFormError('')

    try {
      await addDoc(heistsCollection, {
        title: title.trim(),
        description: description.trim(),
        createdBy: user.uid,
        createdByCodename: user.displayName ?? user.email ?? user.uid,
        assignedTo: assignedToUid,
        assignedToCodename: assignee?.codename ?? assignedToUid,
        createdAt: serverTimestamp(),
        deadline: Timestamp.fromDate(new Date(Date.now() + 48 * 60 * 60 * 1000)),
        finalStatus: null,
      })
      router.push('/heists')
    } catch {
      setFormError('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="center-content">
      <div className={`page-content ${styles.card}`}>
        <h2 className="form-title">Create a New Heist</h2>

        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="title" className={styles.label}>Mission title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.textarea}
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="assignedTo" className={styles.label}>Assign to</label>
            <select
              id="assignedTo"
              value={assignedToUid}
              onChange={(e) => setAssignedToUid(e.target.value)}
              className={styles.select}
              disabled={usersLoading}
            >
              {usersLoading && <option>Loading agents…</option>}
              {!usersLoading && users.length === 0 && (
                <option value="">No other agents found</option>
              )}
              {users.map((u) => (
                <option key={u.uid} value={u.uid}>{u.codename}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn" disabled={isLoading || usersLoading}>
            {isLoading ? 'Launching heist…' : 'Launch heist'}
          </button>

          {formError && <span className={styles.error}>{formError}</span>}
        </form>
      </div>
    </div>
  )
}
