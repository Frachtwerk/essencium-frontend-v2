import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/shared/copy-button'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import type { ApiTokenRepresentation } from '@/generated/client/types.gen'

interface ApiTokenRevealDialogProps {
  token: ApiTokenRepresentation | undefined
  onOpenChange: (open: boolean) => void
}

export function ApiTokenRevealDialog({
  token,
  onOpenChange,
}: ApiTokenRevealDialogProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <Dialog open={token !== undefined} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t('apiTokens.reveal.title')}</DialogTitle>
          <DialogDescription>{t('apiTokens.reveal.hint')}</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input readOnly value={token?.token ?? ''} className="font-mono" />
          <CopyButton value={token?.token ?? ''} />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            {t('apiTokens.reveal.close')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
