import type { FieldValue, Timestamp } from 'firebase/firestore'

export type HeistFinalStatus = 'success' | 'failure'

export interface Heist {
  id: string
  title: string
  description: string
  createdBy: string
  createdByCodename: string
  assignedTo: string
  assignedToCodename: string
  deadline: Date
  finalStatus: HeistFinalStatus | null
  createdAt: Date
}

export interface CreateHeistInput {
  title: string
  description: string
  createdBy: string
  createdByCodename: string
  assignedTo: string
  assignedToCodename: string
  deadline: FieldValue | Timestamp
  finalStatus: null
  createdAt: FieldValue
}

export interface UpdateHeistInput {
  title?: string
  description?: string
  assignedTo?: string
  assignedToCodename?: string
  deadline?: FieldValue
  finalStatus?: HeistFinalStatus | null
}
