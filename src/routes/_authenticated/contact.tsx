import { createFileRoute } from '@tanstack/react-router'

import { ContactPage } from '@/pages/contact/contact-page'

export const Route = createFileRoute('/_authenticated/contact')({
  component: ContactPage,
})
