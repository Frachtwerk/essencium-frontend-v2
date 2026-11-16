import {
  RiArrowDownSLine,
  RiArrowUpDownLine,
  RiArrowUpSLine,
  RiSkipBackMiniLine,
  RiSkipForwardMiniLine,
} from '@remixicon/react'
/* eslint-disable import-x/named -- import-x cannot statically resolve @tanstack/react-table's exports */
import {
  Column,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type SortingState,
} from '@tanstack/react-table'
/* eslint-enable import-x/named */
import type { CSSProperties, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Field, FieldLabel } from './ui/field'

import { PageJumpCombobox } from '@/components/shared/page-jump-combobox'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { PAGE_SIZE_OPTIONS } from '@/lib/pagination'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  totalElements: number
  currentPage: number
  pinnedColumns?: string[]
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  onRowClick?: (row: Row<TData>) => void
  /**
   * Decides per row whether {@link onRowClick} applies. Rows for which this
   * returns `false` are not clickable and show no pointer cursor. Defaults to
   * all rows being clickable when `onRowClick` is set.
   */
  isRowClickable?: (row: Row<TData>) => boolean
  /** Current sort state; when provided, sortable headers become clickable. */
  sorting?: SortingState
  onSortingChange?: OnChangeFn<SortingState>
  /**
   * Stable row identity. Without it TanStack Table falls back to the row index,
   * so any change to `data` remounts the cells — which loses focus and drops
   * pending per-call mutation callbacks. Supply this when cells hold state.
   */
  getRowId?: (row: TData, index: number) => string
}

/**
 * Server-paginated table built on TanStack Table. Pagination is manual: the
 * caller drives page/size via search params and handles the change callbacks.
 * Mirrors the eps-core DataTable pattern.
 */

/**
 * Offset of a left-pinned column. Stays an inline style because the value is
 * computed from the widths of the preceding columns.
 */
function getPinningStyles<TData>(column: Column<TData>): CSSProperties {
  const isPinned = column.getIsPinned()
  return {
    left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
  }
}

/** Static part of the pinning treatment — expressed as design tokens. */
function getPinningClasses<TData>(column: Column<TData>): string {
  return column.getIsPinned() ? 'bg-background sticky z-1' : 'relative z-0'
}

type PageItem = number | 'gap-start' | 'gap-end'

/**
 * Page slots (0-based) with ellipses. Full, from `xl`: all pages up to 7, then
 * `1 2 3 4 … 8 9` · `1 … 3 4 5 … 9` · `1 2 … 6 7 8 9`.
 * Compact, below `xl`: all pages up to 4, then
 * `1 2 3 4 …` · `… 3 4 5 …` · `… 6 7 8 9`.
 */
function getPageItems(
  current: number,
  last: number,
  compact: boolean,
): PageItem[] {
  if (last < (compact ? 4 : 7)) {
    return Array.from({ length: last + 1 }, (_, page) => page)
  }
  if (current <= 2) {
    return [0, 1, 2, 3, 'gap-end', ...(compact ? [] : [last - 1, last])]
  }
  if (current >= last - 2) {
    return [
      ...(compact ? [] : [0, 1]),
      'gap-start',
      last - 3,
      last - 2,
      last - 1,
      last,
    ]
  }
  return [
    ...(compact ? [] : [0]),
    'gap-start',
    current - 1,
    current,
    current + 1,
    'gap-end',
    ...(compact ? [] : [last]),
  ]
}

function pageLinkProps(enabled: boolean, onSelect: () => void): object {
  return {
    'aria-disabled': !enabled,
    tabIndex: enabled ? undefined : -1,
    className: enabled ? undefined : 'pointer-events-none opacity-50',
    onClick: (event: React.MouseEvent) => {
      event.preventDefault()
      if (enabled) onSelect()
    },
  }
}

export function DataTable<TData, TValue>(
  props: Readonly<DataTableProps<TData, TValue>>,
): React.ReactElement {
  const { t } = useTranslation()

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    manualPagination: true,
    manualSorting: true,
    rowCount: props.totalElements,
    pageCount: props.totalPages,
    getCoreRowModel: getCoreRowModel(),
    ...(props.getRowId ? { getRowId: props.getRowId } : {}),
    onSortingChange: props.onSortingChange,
    onPaginationChange: updater => {
      const current = { pageIndex: props.currentPage, pageSize: props.pageSize }

      const next = typeof updater === 'function' ? updater(current) : updater

      if (next.pageSize !== current.pageSize) {
        props.onPageSizeChange(next.pageSize)
      } else {
        props.onPageChange(next.pageIndex)
      }
    },
    initialState: {
      columnPinning: {
        left: props.pinnedColumns,
      },
    },
    state: {
      pagination: {
        pageIndex: props.currentPage,
        pageSize: props.pageSize,
      },
      sorting: props.sorting ?? [],
    },
  })

  const pageCount = table.getPageCount()

  function renderPageItems(compact: boolean, className: string): ReactNode {
    return getPageItems(props.currentPage, pageCount - 1, compact).map(item => (
      <PaginationItem key={`${compact}-${item}`} className={className}>
        {typeof item === 'string' ? (
          <PaginationEllipsis />
        ) : (
          <PaginationLink
            href="#"
            isActive={item === props.currentPage}
            {...pageLinkProps(true, () => table.setPageIndex(item))}
          >
            {item + 1}
          </PaginationLink>
        )}
      </PaginationItem>
    ))
  }

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  if (header.isPlaceholder) {
                    return <TableHead key={header.id} />
                  }
                  const content = flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )
                  if (!header.column.getCanSort()) {
                    return <TableHead key={header.id}>{content}</TableHead>
                  }
                  const sorted = header.column.getIsSorted()
                  return (
                    <TableHead
                      key={header.id}
                      className={getPinningClasses(header.column)}
                      style={getPinningStyles(header.column)}
                    >
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          '-ml-1 flex items-center gap-1 rounded px-1 py-0.5',
                          'hover:text-foreground cursor-pointer select-none',
                        )}
                        aria-label={t('common.sortBy')}
                      >
                        {content}
                        {sorted === 'asc' ? (
                          <RiArrowUpSLine className="size-4" />
                        ) : sorted === 'desc' ? (
                          <RiArrowDownSLine className="size-4" />
                        ) : (
                          <RiArrowUpDownLine className="text-muted-foreground size-4" />
                        )}
                      </button>
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => {
                const clickable =
                  props.onRowClick !== undefined &&
                  (props.isRowClickable?.(row) ?? true)
                return (
                  <TableRow
                    key={row.id}
                    className={clickable ? 'cursor-pointer' : undefined}
                    onClick={
                      clickable ? () => props.onRowClick?.(row) : undefined
                    }
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell
                        key={cell.id}
                        className={getPinningClasses(cell.column)}
                        style={getPinningStyles(cell.column)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="text-muted-foreground h-24 text-center"
                >
                  {t('common.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 py-4">
        <Field orientation="horizontal" className="w-fit">
          <FieldLabel
            htmlFor="select-rows-per-page"
            className="text-muted-foreground font-normal"
          >
            {t('common.size')}:
          </FieldLabel>

          <Select
            value={String(props.pageSize)}
            onValueChange={value => table.setPageSize(Number(value))}
          >
            <SelectTrigger
              id="select-rows-per-page"
              size="sm"
              aria-label={t('common.pageSize')}
            >
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {PAGE_SIZE_OPTIONS.map(option => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <div className="flex items-center gap-6">
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label={t('common.firstPage')}
                  {...pageLinkProps(
                    table.getCanPreviousPage(),
                    table.firstPage,
                  )}
                >
                  <RiSkipBackMiniLine className="size-4" />
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className="pr-8"
                  {...pageLinkProps(
                    table.getCanPreviousPage(),
                    table.previousPage,
                  )}
                />
              </PaginationItem>

              {renderPageItems(false, 'hidden xl:list-item')}

              {renderPageItems(true, 'xl:hidden')}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  {...pageLinkProps(table.getCanNextPage(), table.nextPage)}
                />
              </PaginationItem>

              <PaginationItem>
                <PaginationLink
                  href="#"
                  aria-label={t('common.lastPage')}
                  {...pageLinkProps(table.getCanNextPage(), table.lastPage)}
                >
                  <RiSkipForwardMiniLine className="size-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <PageJumpCombobox
            currentPage={props.currentPage}
            pageCount={pageCount}
            onPageChange={page => table.setPageIndex(page)}
          />
        </div>
      </div>
    </div>
  )
}
