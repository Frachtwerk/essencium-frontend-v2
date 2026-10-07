import { RiDeleteBinLine, RiEditLine } from '@remixicon/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { CanAccess } from '@/components/shared/can-access'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUpdateTranslation } from '@/hooks/data/translations'
import { RIGHTS } from '@/lib/permissions'
import {
  toDisplayText,
  type TranslationEntry,
  type TranslationLocale,
} from '@/lib/translations'

interface TranslationRowProps {
  entry: TranslationEntry
  locale: TranslationLocale
  onDelete: (key: string) => void
}

export function TranslationRow({
  entry,
  locale,
  onDelete,
}: Readonly<TranslationRowProps>): React.ReactElement {
  const { t } = useTranslation()

  const updateTranslation = useUpdateTranslation()

  const label = entry.key.split('.').pop()

  const [draft, setDraft] = useState<string | undefined>(undefined)

  function save(): void {
    if (draft === undefined) return
    updateTranslation.mutate(
      { path: { locale, key: entry.key }, body: draft },
      {
        onSuccess: () => {
          toast.success(t('translations.saveSuccess'))
          setDraft(undefined)
        },
        onError: () => toast.error(t('translations.saveError')),
      },
    )
  }

  return (
    <div className="mt-4 flex flex-col">
      <p className="text-muted-foreground text-xs">{entry.key}</p>

      <div className="border-foreground/30 flex items-start gap-3 border-t py-2 pl-2 first:border-t-0">
        <span className="text-muted-foreground w-36 shrink-0 truncate font-mono text-sm">
          {label}
        </span>

        {draft ? (
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <Textarea
              ref={el => el?.focus()}
              aria-label={entry.key}
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save()
                if (e.key === 'Escape') setDraft(undefined)
              }}
            />

            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDraft(undefined)}
              >
                {t('common.back')}
              </Button>

              <Button
                size="sm"
                disabled={updateTranslation.isPending}
                onClick={save}
              >
                {t('common.save')}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <span className="min-w-0 flex-1 text-sm break-words whitespace-pre-line">
              {toDisplayText(entry.value)}
            </span>

            <CanAccess rights={RIGHTS.TRANSLATION_UPDATE}>
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('common.edit')}
                  onClick={() => setDraft(entry.value)}
                >
                  <RiEditLine className="size-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t('common.delete')}
                  onClick={() => onDelete(entry.key)}
                >
                  <RiDeleteBinLine className="text-destructive-400 size-4" />
                </Button>
              </div>
            </CanAccess>
          </>
        )}
      </div>
    </div>
  )
}
