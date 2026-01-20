'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (item: T) => React.ReactNode;
  mobileLabel?: string; // Custom label for mobile view
  hideOnMobile?: boolean; // Hide this column on mobile
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  mobileCardView?: boolean; // Show as cards on mobile instead of table
  emptyMessage?: string;
  loading?: boolean;
  loadingMessage?: string;
  onRowClick?: (item: T) => void;
}

export function ResponsiveTable<T>({
  data,
  columns,
  keyExtractor,
  mobileCardView = false,
  emptyMessage = 'No data available',
  loading = false,
  loadingMessage = 'Loading...',
  onRowClick,
}: ResponsiveTableProps<T>) {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="mt-4 text-gray-500">{loadingMessage}</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  // Desktop/Tablet: Standard table view
  const DesktopTable = () => (
    <div className={cn("overflow-x-auto", mobileCardView ? "hidden md:block" : "block")}>
      <div className="inline-block min-w-full align-middle">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn("whitespace-nowrap", column.className)}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick && "cursor-pointer hover:bg-gray-50")}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn("whitespace-nowrap", column.className)}
                  >
                    {column.render
                      ? column.render(item)
                      : String((item as any)[column.key] ?? '-')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  // Mobile: Card view
  const MobileCards = () => (
    <div className="md:hidden space-y-4">
      {data.map((item) => (
        <Card
          key={keyExtractor(item)}
          onClick={() => onRowClick?.(item)}
          className={cn(
            "p-4 space-y-3",
            onRowClick && "cursor-pointer hover:shadow-md transition-shadow"
          )}
        >
          {columns
            .filter((column) => !column.hideOnMobile)
            .map((column) => (
              <div key={column.key} className="flex justify-between items-start gap-4">
                <span className="text-sm font-medium text-gray-500 flex-shrink-0">
                  {column.mobileLabel || column.label}:
                </span>
                <div className="text-sm text-gray-900 text-right flex-1 truncate">
                  {column.render
                    ? column.render(item)
                    : String((item as any)[column.key] ?? '-')}
                </div>
              </div>
            ))}
        </Card>
      ))}
    </div>
  );

  return (
    <>
      <DesktopTable />
      {mobileCardView && <MobileCards />}
    </>
  );
}

// Utility component for consistent responsive table wrapper
export function ResponsiveTableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden px-4 sm:px-0">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
