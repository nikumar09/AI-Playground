'use client'

import { useEffect, useState } from 'react'
import { query, where, onSnapshot, Timestamp } from 'firebase/firestore'
import type { Heist } from '@/types/firestore'
import { heistsCollection } from '@/lib/firestore'
import { useUser } from '@/context/AuthContext'

export type HeistMode = 'active' | 'assigned' | 'expired'

export function useHeists(mode: HeistMode): { heists: Heist[]; loading: boolean } {
  const { user } = useUser()
  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setHeists([])
      setLoading(false)
      return
    }

    const now = Timestamp.now()

    const q =
      mode === 'active'
        ? query(heistsCollection, where('assignedTo', '==', user.uid), where('deadline', '>', now))
        : mode === 'assigned'
        ? query(heistsCollection, where('createdBy', '==', user.uid), where('deadline', '>', now))
        : query(heistsCollection, where('deadline', '<=', now), where('finalStatus', '!=', null))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHeists(snapshot.docs.map((doc) => doc.data()))
      setLoading(false)
    })

    return unsubscribe
  }, [mode, user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  return { heists, loading }
}
