import { z } from 'zod'

export const contactFormSubmissionSchema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      errorMap: (_, context) => (context.data === '' ? { message: 'email-required' } : { message: 'email-invalid' }),
    })
    .email(),
  subject: z.string().optional(),
  message: z.string({ errorMap: () => ({ message: 'message-required' }) }).min(1),
})

export type ContactFormSchema = typeof contactFormSubmissionSchema
export type ContactFormSubmission = z.infer<typeof contactFormSubmissionSchema>
