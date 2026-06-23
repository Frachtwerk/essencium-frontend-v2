/* eslint-disable import-x/named -- import-x cannot statically resolve @tanstack/react-table's exports */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type Row,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  totalPages: number
  totalElements: number
  currentPage: number
  renderNextPageButton: (props: { disabled: boolean }) => ReactNode
  renderPreviousPageButton: (props: { disabled: boolean }) => ReactNode
  onRowClick?: (row: Row<TData>) => void
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
    rowCount: props.totalElements,
    pageCount: props.totalPages,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: props.currentPage,
        pageSize: props.data.length || 1,
      },
    },
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow
                  key={row.id}
                  className={props.onRowClick ? 'cursor-pointer' : undefined}
                  onClick={
                    props.onRowClick ? () => props.onRowClick?.(row) : undefined
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
              ))
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
