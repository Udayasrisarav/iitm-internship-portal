import type { ReactNode } from 'react';
import { classNames } from '../../utils/format';

interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  headerClassName?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: ReactNode;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends { id: string }>({ columns, data, emptyMessage = 'No records found.', onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-hidden rounded-xl border border-ink-200/70 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-100">
          <thead className="bg-ink-50/70">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={classNames(
                    'px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-ink-500',
                    col.headerClassName,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100 bg-white">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-5 py-12 text-center text-sm text-ink-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  className={classNames(
                    'transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-ink-50/60',
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={classNames('whitespace-nowrap px-5 py-3.5 text-sm text-ink-700', col.className)}>
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
