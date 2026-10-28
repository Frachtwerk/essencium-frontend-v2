import { createFileRoute } from '@tanstack/react-router'

import { LegalNoticePage } from '@/pages/legal-notice/legal-notice-page'

export const Route = createFileRoute('/_authenticated/legal-notice')({
  component: LegalNoticePage,
})
