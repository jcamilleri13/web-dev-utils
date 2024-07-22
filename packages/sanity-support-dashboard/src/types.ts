export interface Issue {
  closed_at: string | null
  created_at: string
  description?: string
  id: number
  labels: string[]
  state: 'open' | 'closed'
  title: string
}

export enum SUPPORT_LEVEL {
  NONE = 'none',
  STANDARD = 'standard',
  PREMIUM = 'premium',
}

export interface SupportDetails {
  expiry?: string
  level: SUPPORT_LEVEL
}
