export default {
  type: 'document',
  name: 'formContact',
  title: 'Contact Form Submission',
  __experimental_actions: [],

  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      readonly: true,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      readonly: true,
    },
    {
      name: 'subject',
      title: 'Subject',
      type: 'string',
      readonly: true,
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      readonly: true,
    },
  ],

  preview: {
    select: {
      createdAt: '_createdAt',
      name: 'name',
      subject: 'subject',
    },
    prepare({ name, subject, createdAt }) {
      return {
        title: subject ? `${subject} (${name})` : name,
        subtitle: new Date(createdAt).toLocaleString(),
      }
    },
  },
}
