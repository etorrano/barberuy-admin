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
import CardContainer from "@/components/layout/card-container/card-container";
import { Link, useLoaderData } from "react-router-dom";
import { ColumnDef } from "@tanstack/react-table";
import { commonColumns, DataTable } from "@/components/ui/data-table";
import { useToast } from "@/hooks/use-toast";
import { DataTableActions } from "@/components/ui/data-table-actions";
import { ArrowLeft } from "lucide-react";
import SalesPointForm from "@/components/salespoint/salespoint-form/salespoint-form";
import { SalesPoint } from "@/models/salespoint.model";
import { deleteSalesPoint } from "@/api/client";

export default function SalesPointPage() {
  const data: any = useLoaderData();
  const { toast } = useToast();
  const [displayTable, setDisplayTable] = useState(true);
  const [salespoint, setSalesPoint] = useState<SalesPoint | undefined>(
    undefined
  );
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [salespoints, setSalesPoints] = useState<SalesPoint[]>([]);

  useEffect(() => {
    setSalesPoints(data?.data);
  }, [data]);

  const handleEditSalesPoint = (data: SalesPoint, rowIndex: number) => {
    setSalesPoint(data);
    setDisplayTable(false);
    setEditingRowIndex(rowIndex);
  };

  const handleDeleteSalesPoint = async (id: string, rowIndex: number) => {
    const res = await deleteSalesPoint(id);
    if (res.status === 200) {
      toast({
        title: "Completado",
        description: "El punto de venta fue eliminado",
      });
      if (rowIndex !== undefined) {
        const updatedUsers = [...salespoints];
        updatedUsers.splice(rowIndex, 1);
        setSalesPoints(updatedUsers);
      }
    } else {
      toast({
        title: "Error",
        description:
          "Error al intentar eliminar el punto de venta. Por favor, intente nuevamente",
        variant: "destructive",
      });
    }
  };

  const handleUpdateSalesPoint = (updatedData: SalesPoint) => {
    if (editingRowIndex !== null) {
      const updatedSalesPoints = [...salespoints];
      updatedSalesPoints[editingRowIndex] = Object.assign(
        updatedSalesPoints[editingRowIndex],
        {
          name: updatedData.name,
          street: updatedData.street,
          streetNumber: updatedData.streetNumber,
          floor: updatedData.floor,
          updatedAt: Date.now(),
        }
      );
      setSalesPoints(updatedSalesPoints);
    }
    setDisplayTable(true);
  };

  const columns: ColumnDef<SalesPoint>[] = [
    ...([
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "street",
        header: "Calle",
      },
      {
        accessorKey: "streetNumber",
        header: "Número de puerta",
      },
      {
        accessorKey: "floor",
        header: "Número de apartamento",
        cell: ({ getValue }) => {
          const value = getValue();
          return value ? value : "No corresponde";
        },
      },
    ] as ColumnDef<SalesPoint>[]),
    ...commonColumns,
    ...([
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DataTableActions
              onEdit={() => handleEditSalesPoint(row.original, row.index)}
              onDelete={() =>
                handleDeleteSalesPoint(row.original.id, row.index)
              }
            />
          );
        },
      },
    ] as ColumnDef<any>[]),
  ] as ColumnDef<SalesPoint>[];

  return (
    <ContentLayout title="Puntos de Venta">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Puntos de Venta</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardContainer>
        {displayTable ? (
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={salespoints} />
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
            <SalesPointForm
              salespoint={salespoint}
              updateSalesPoint={handleUpdateSalesPoint}
            />
          </div>
        )}
      </CardContainer>
    </ContentLayout>
  );
}
