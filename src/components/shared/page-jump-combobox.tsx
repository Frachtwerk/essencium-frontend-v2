import { useVirtualizer } from '@tanstack/react-virtual'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'

interface PageJumpComboboxProps {
  currentPage: number
  pageCount: number
  onPageChange: (page: number) => void
}

export function PageJumpCombobox({
  currentPage,
  pageCount,
  onPageChange,
}: Readonly<PageJumpComboboxProps>): React.ReactElement {
  const { t } = useTranslation()

  const [scrollElement, setScrollElement] = useState<HTMLDivElement | null>(
    null,
  )

  const [query, setQuery] = useState('')

  const options = useMemo(() => {
    const pages = Array.from({ length: pageCount }, (_, page) =>
      String(page + 1),
    )

    return query.length ? pages.filter(page => page.includes(query)) : pages
  }, [pageCount, query])

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollElement,
    estimateSize: () => 32,
    overscan: 10,
  })

  return (
    <Combobox
      virtualized
      items={options}
      filteredItems={options}
      value={String(currentPage + 1)}
      onValueChange={value => {
        if (value) onPageChange(Number(value) - 1)
      }}
      onInputValueChange={value => setQuery(value)}
      onItemHighlighted={(_item, { reason, index }) => {
        if (index >= 0 && (reason === 'none' || reason === 'keyboard')) {
          virtualizer.scrollToIndex(index)
        }
      }}
    >
      <ComboboxInput
        className="w-26"
        inputMode="numeric"
        aria-label={t('common.jumpToPage')}
      />

      <ComboboxContent>
        <ComboboxEmpty>{t('common.noResults')}</ComboboxEmpty>

        <ComboboxList ref={setScrollElement} className="max-h-64">
          <div
            className="relative w-full"
            style={{ height: virtualizer.getTotalSize() }}
          >
            {virtualizer.getVirtualItems().map(virtualItem => {
              const page = options[virtualItem.index]

              if (page === undefined) return null

              return (
                <ComboboxItem
                  key={page}
                  value={page}
                  index={virtualItem.index}
                  aria-setsize={options.length}
                  aria-posinset={virtualItem.index + 1}
                  className="absolute top-0 left-0"
                  style={{
                    height: virtualItem.size,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  {page}
                </ComboboxItem>
              )
            })}
          </div>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
