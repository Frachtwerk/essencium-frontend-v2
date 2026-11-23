import {
  RiArrowDownSLine,
  RiArrowUpDownLine,
  RiArrowUpSLine,
} from '@remixicon/react'
import {
  columnPinningFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  flexRender,
  rowPaginationFeature,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type Column,
  type ColumnDef,
  type OnChangeFn,
  type Row,
  type RowData,
  type SortingState,
} from '@tanstack/react-table'
import type { CSSProperties, ReactNode } from 'react'
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

/** The table features this DataTable uses; v9 requires them to be declared. */
const dataTableFeatures = tableFeatures({
  columnPinningFeature,
  columnSizingFeature, // provides column.getStart() for the pinning offset
  columnVisibilityFeature, // provides row.getVisibleCells()
  rowPaginationFeature,
  rowSortingFeature,
})

type DataTableFeatures = typeof dataTableFeatures

/** Column definition bound to the features of {@link DataTable}. */
export type DataTableColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<DataTableFeatures, TData, TValue>

interface DataTableProps<TData extends RowData> {
  columns: DataTableColumnDef<TData>[]
  data: TData[]
  totalPages: number
  totalElements: number
  currentPage: number
  pinnedColumns?: string[]
  renderNextPageButton: (props: { disabled: boolean }) => ReactNode
  renderPreviousPageButton: (props: { disabled: boolean }) => ReactNode
  onRowClick?: (row: Row<DataTableFeatures, TData>) => void
  /**
   * Decides per row whether {@link onRowClick} applies. Rows for which this
   * returns `false` are not clickable and show no pointer cursor. Defaults to
   * all rows being clickable when `onRowClick` is set.
   */
  isRowClickable?: (row: Row<DataTableFeatures, TData>) => boolean
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
 * caller drives page/size via search params and supplies the page buttons.
 * Mirrors the eps-core DataTable pattern.
 */

/**
 * Offset of a left-pinned column. Stays an inline style because the value is
 * computed from the widths of the preceding columns.
 */
function getPinningStyles<TData extends RowData>(
  column: Column<DataTableFeatures, TData>,
): CSSProperties {
  const isPinned = column.getIsPinned()
  return {
    left: isPinned === 'start' ? `${column.getStart('start')}px` : undefined,
  }
}

/** Static part of the pinning treatment — expressed as design tokens. */
function getPinningClasses<TData extends RowData>(
  column: Column<DataTableFeatures, TData>,
): string {
  return column.getIsPinned() ? 'bg-background sticky z-1' : 'relative z-0'
}

export function DataTable<TData extends RowData>(
  props: Readonly<DataTableProps<TData>>,
): React.ReactElement {
  const { t } = useTranslation()
  const table = useTable({
    features: dataTableFeatures,
    data: props.data,
    columns: props.columns,
    manualPagination: true,
    manualSorting: true,
    rowCount: props.totalElements,
    pageCount: props.totalPages,
    ...(props.getRowId ? { getRowId: props.getRowId } : {}),
    onSortingChange: props.onSortingChange,
    initialState: {
      columnPinning: {
        start: props.pinnedColumns ?? [],
        end: [],
      },
    },
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
