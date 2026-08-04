import { useTranslation } from 'react-i18next'

import { DebouncedSearchInput } from '@/components/shared/debounced-search-input'

interface AllApiTokensFilterBarProps {
  search: string
  onSearchChange: (value: string) => void
}

export function AllApiTokensFilterBar({
  search,
  onSearchChange,
}: AllApiTokensFilterBarProps): React.ReactElement {
  const { t } = useTranslation()

  return (
    <div className="flex flex-wrap items-start gap-2">
      <DebouncedSearchInput
        value={search}
        onDebouncedChange={onSearchChange}
        placeholder={t('apiTokens.admin.searchPlaceholder')}
        className="max-w-72"
      />
    </div>
  )
}
