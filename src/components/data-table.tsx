import {
  RiArrowDownSLine,
  RiArrowUpDownLine,
  RiArrowUpSLine,
} from '@remixicon/react'
/* eslint-disable import-x/named -- import-x cannot statically resolve @tanstack/react-table's exports */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type SortingState,
} from '@tanstack/react-table'
/* eslint-enable import-x/named */
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  totalElements: number
  currentPage: number
  renderNextPageButton: (props: { disabled: boolean }) => ReactNode
  renderPreviousPageButton: (props: { disabled: boolean }) => ReactNode
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
}

/**
 * Server-paginated table built on TanStack Table. Pagination is manual: the
 * caller drives page/size via search params and supplies the page buttons.
 * Mirrors the eps-core DataTable pattern.
 */
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
    onSortingChange: props.onSortingChange,
    state: {
      pagination: {
        pageIndex: props.currentPage,
        pageSize: props.data.length || 1,
      },
      sorting: props.sorting ?? [],
    },
  })

  return (
    <div>
      <div className="rounded-md border">
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
                    <TableHead key={header.id}>
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
                      <TableCell key={cell.id}>
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
      <div className="flex items-center justify-between gap-2 py-4">
        <p className="text-muted-foreground text-sm">
          {t('common.pageInfo', {
            page: props.currentPage + 1,
            pages: Math.max(props.totalPages, 1),
            total: props.totalElements,
          })}
        </p>
        <div className="flex items-center gap-2">
          {props.renderPreviousPageButton({
            disabled: !table.getCanPreviousPage(),
          })}
          {props.renderNextPageButton({ disabled: !table.getCanNextPage() })}
        </div>
      </div>
    </div>
  )
}
