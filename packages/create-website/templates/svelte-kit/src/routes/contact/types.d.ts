export interface ContactRequest {
  body: {
    name: string
    email: string
    subject?: string
    message: string
  }
}

export interface ContactResponse {
  status: number
  body: string
}

export interface ContactPayload {
  name: string
  email: string
  subject?: string
  message: string
}
