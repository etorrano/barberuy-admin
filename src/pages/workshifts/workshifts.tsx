import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import CardContainer from "@/components/layout/card-container/card-container";
import { useLoaderData } from "react-router-dom";
import { format } from "date-fns";
import { Days, Workshift } from "@/models/workshift.model";
import { ColumnDef } from "@tanstack/react-table";
import { daysOptions } from "@/components/workshift/workshift-form/workshift-form";
import { DataTable } from "@/components/ui/data-table";

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

export default function WorkshiftsPage() {
  const data: any = useLoaderData();
  return (
    <AdminPanelLayout>
      <ContentLayout title="Turnos">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/">Inicio</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Turnos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardContainer>
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={data.data} />
          </div>
        </CardContainer>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
