export interface Issue {
  dateCreated: string
  description: string
  id: string
  labels: string[]
  title: string
  status: 'open' | 'closed'
  closedOn?: string
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
