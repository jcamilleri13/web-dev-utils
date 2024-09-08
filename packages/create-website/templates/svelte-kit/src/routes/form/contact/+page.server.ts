import { superValidate } from 'sveltekit-superforms'
import { zod } from 'sveltekit-superforms/adapters'

import { contactFormAction } from '$lib/forms/contact/action'
import { contactFormSubmissionSchema } from '$lib/forms/contact/schema'

// Pages with actions cannot be pre-rendered.
// This form should be accessed with use:enhance from other pages,
// with this page being used as a fallback if a user has JavaScript disabled.
export const prerender = false

export const load = async () => {
  const form = await superValidate(zod(contactFormSubmissionSchema))

  return { form }
}

export const actions = {
  default: contactFormAction,
}
