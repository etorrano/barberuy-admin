"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { Days, Workshift } from "@/models/workshift.model";
import { daysOptions } from "../workshift-form/workshift-form";

export const columns: ColumnDef<Workshift>[] = [
  {
    accessorKey: "days",
    header: "Días",
    cell: ({ getValue }) => {
      const days = getValue() as Days[];
      return days.map(
        (day: string, index) =>
          daysOptions.find((opt) => opt.value === day)?.label +
            (index !== days.length - 1 ? ", " : "") || day
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Hora de Inicio",
  },
  {
    accessorKey: "endTime",
    header: "Hora de finalización",
  },
  {
    accessorKey: "createdAt",
    header: "Fecha de Creación",
    cell: ({ getValue }) =>
      format(new Date(getValue() as number), "dd/MM/yyyy HH:mm:ss"),
  },
  {
    accessorKey: "updatedAt",
    header: "Fecha de Modificación",
    cell: ({ getValue }) =>
      format(new Date(getValue() as number), "dd/MM/yyyy HH:mm:ss"),
  },
];

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function WorkshiftsList<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
