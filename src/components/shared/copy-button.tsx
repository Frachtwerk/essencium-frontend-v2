import { RiFileCopyLine } from '@remixicon/react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

interface CopyButtonProps {
  value: string
  label?: string
}

export function CopyButton({
  value,
  label,
}: CopyButtonProps): React.ReactElement {
  const { t } = useTranslation()

  function handleCopy(): void {
    void navigator.clipboard.writeText(value).then(() => {
      toast.success(t('common.copied'))
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label={label ?? t('common.copy')}
      onClick={handleCopy}
    >
      <RiFileCopyLine className="size-4" />
    </Button>
  )
}
