import { RiArrowRightSLine } from '@remixicon/react'

import { TranslationRow } from './translation-row'

import { Badge } from '@/components/ui/badge'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  countEntries,
  type TranslationGroup,
  type TranslationLocale,
} from '@/lib/translations'
import { cn } from '@/lib/utils'

interface TranslationGroupNodeProps {
  group: TranslationGroup
  locale: TranslationLocale
  expanded: boolean
  onDelete: (key: string) => void
  nested?: boolean
}

export function TranslationGroupNode({
  group,
  locale,
  expanded,
  onDelete,
  nested = false,
}: Readonly<TranslationGroupNodeProps>): React.ReactElement {
  return (
    <>
      {group.entries.map(entry => (
        <TranslationRow
          key={entry.key}
          entry={entry}
          locale={locale}
          onDelete={onDelete}
        />
      ))}

      {group.groups.map(child => (
        <Collapsible
          key={`${child.name}-${expanded}`}
          defaultOpen={expanded}
          className={cn(
            nested
              ? 'border-foreground/30 border-t'
              : 'bg-card border-foreground/50 overflow-hidden rounded-lg border',
          )}
        >
          <CollapsibleTrigger
            className={cn(
              'group hover:bg-muted flex w-full cursor-pointer items-center gap-2 py-2 font-semibold',
              !nested && 'px-4 py-3',
            )}
          >
            <RiArrowRightSLine className="size-5 transition-transform group-data-[panel-open]:rotate-90" />
            {child.name}

            <Badge variant="secondary" className="ml-auto">
              {countEntries(child)}
            </Badge>
          </CollapsibleTrigger>

          <CollapsibleContent
            className={cn(
              'pl-10',
              !nested && 'border-foreground/50 border-t px-4 pb-2',
            )}
          >
            <TranslationGroupNode
              group={child}
              locale={locale}
              expanded={expanded}
              onDelete={onDelete}
              nested
            />
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  )
}
