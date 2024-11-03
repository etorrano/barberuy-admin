import React, { useEffect, useState } from "react";
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
import WorkshiftForm, {
  daysOptions,
} from "@/components/workshift/workshift-form/workshift-form";
import { commonColumns, DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { DataTableActions } from "@/components/ui/data-table-actions";
import { deleteWorkshift } from "@/api/client";
import { ArrowLeft } from "lucide-react";

export default function WorkshiftsPage() {
  const data: any = useLoaderData();
  const { toast } = useToast();
  const [displayTable, setDisplayTable] = useState(true);
  const [workshift, setWorkshift] = useState<Workshift | undefined>(undefined);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [workshifts, setWorkshifts] = useState<Workshift[]>([]);

  useEffect(() => {
    setWorkshifts(data.data);
  }, [data]);

  const handleEditWorkshift = (data: Workshift, rowIndex: number) => {
    setWorkshift(data);
    setDisplayTable(false);
    setEditingRowIndex(rowIndex);
  };

  const handleDeleteWorkshift = async (id: string, rowIndex: number) => {
    const res = await deleteWorkshift(id);
    if (res.status === 200) {
      toast({
        title: "Completado",
        description: "El turno fue eliminado",
      });
      if (rowIndex !== undefined) {
        const updatedUsers = [...workshifts];
        updatedUsers.splice(rowIndex, 1);
        setWorkshifts(updatedUsers);
      }
    } else {
      toast({
        title: "Error",
        description:
          "Error al intentar eliminar el turno. Por favor, intente nuevamente",
        variant: "destructive",
      });
    }
  };

  const handleUpdateWorkshift = (updatedData: Workshift) => {
    if (editingRowIndex !== null) {
      const updatedWorkshifts = [...workshifts];
      updatedWorkshifts[editingRowIndex] = Object.assign(
        updatedWorkshifts[editingRowIndex],
        {
          days: updatedData.days,
          startTime: updatedData.startTime,
          endTime: updatedData.endTime,
          updatedAt: Date.now(),
        }
      );
      setWorkshifts(updatedWorkshifts);
    }
    setDisplayTable(true);
  };

  const columns: ColumnDef<Workshift>[] = [
    ...([
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
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "email",
        header: "Correo Electrónico",
      },
    ] as ColumnDef<Workshift>[]),
    ...commonColumns,
    ...([
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DataTableActions
              onEdit={() => handleEditWorkshift(row.original, row.index)}
              onDelete={() => handleDeleteWorkshift(row.original.id, row.index)}
            />
          );
        },
      },
    ] as ColumnDef<any>[]),
  ] as ColumnDef<Workshift>[];

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
          {displayTable ? (
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={workshifts} />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-4">
                <ArrowLeft
                  className="cursor-pointer"
                  onClick={() => setDisplayTable(true)}
                />
                <span>Volver al listado</span>
              </div>
              <br />
              <WorkshiftForm
                workshift={workshift}
                updateWorkshift={handleUpdateWorkshift}
              />
            </div>
          )}
        </CardContainer>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
