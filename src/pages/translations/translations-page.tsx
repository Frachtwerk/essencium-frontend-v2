import { RiTranslate2 } from '@remixicon/react'
import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

import { TranslationGroupNode } from './translation-group-node'

import { PageHeader } from '@/components/layout/page-header'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { DebouncedSearchInput } from '@/components/shared/debounced-search-input'
import { EmptyState } from '@/components/shared/empty-state'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useDeleteTranslation,
  useTranslations,
} from '@/hooks/data/translations'
import {
  filterTranslations,
  groupTranslations,
  TRANSLATION_LOCALES,
  type TranslationLocale,
} from '@/lib/translations'

const route = getRouteApi('/_authenticated/translations')

export function TranslationsPage(): React.ReactElement {
  const { t } = useTranslation()

  const { locale, search } = route.useSearch()

  const navigate = route.useNavigate()

  const { data: entries } = useTranslations(locale)

  const deleteTranslation = useDeleteTranslation()

  const [keyToDelete, setKeyToDelete] = useState<string | undefined>(undefined)

  const filtered = filterTranslations(entries, search)

  const root = groupTranslations(filtered)

  function confirmDelete(): void {
    if (!keyToDelete) return
    deleteTranslation.mutate(
      { path: { key: keyToDelete } },
      {
        onSuccess: () => {
          toast.success(t('translations.deleteSuccess'))
          setKeyToDelete(undefined)
        },
        onError: () => toast.error(t('translations.deleteError')),
      },
    )
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader title={t('translations.title')} />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <DebouncedSearchInput
          value={search}
          onDebouncedChange={value => {
            void navigate({ search: prev => ({ ...prev, search: value }) })
          }}
          placeholder={t('translations.searchPlaceholder')}
          className="max-w-72"
        />

        <Tabs
          value={locale}
          onValueChange={value => {
            void navigate({
              search: prev => ({ ...prev, locale: value as TranslationLocale }),
            })
          }}
        >
          <TabsList>
            {TRANSLATION_LOCALES.map(l => (
              <TabsTrigger key={l} value={l}>
                {t(`translations.locale.${l}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={RiTranslate2} title={t('common.noResults')} />
      ) : (
        <div className="space-y-3">
          <TranslationGroupNode
            group={root}
            locale={locale}
            expanded={search !== ''}
            onDelete={setKeyToDelete}
          />
        </div>
      )}

      <ConfirmDialog
        open={keyToDelete !== undefined}
        onOpenChange={isOpen => {
          if (!isOpen) setKeyToDelete(undefined)
        }}
        title={t('translations.deleteTitle')}
        description={t('translations.deleteConfirm', {
          key: keyToDelete ?? '',
        })}
        confirmLabel={t('common.delete')}
        onConfirm={confirmDelete}
        isPending={deleteTranslation.isPending}
      />
    </div>
  )
}
