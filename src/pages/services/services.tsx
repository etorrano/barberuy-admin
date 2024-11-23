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
import { commonColumns, DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableActions } from "@/components/ui/data-table-actions";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Service } from "@/models/service.model";
import { deleteService } from "@/api/client";
import { SalesPoint } from "@/models/salespoint.model";

export default function ServicesPage() {
  const data: any = useLoaderData();
  const { toast } = useToast();
  const [displayTable, setDisplayTable] = useState(true);
  const [service, setService] = useState<Service | undefined>(undefined);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [salespoints, setSalespoints] = useState<SalesPoint[]>([]);

  useEffect(() => {
    setServices(data?.[0].data);
    setSalespoints(data?.[1].data);
  }, [data]);

  const handleEditService = (data: Service, rowIndex: number) => {
    setService(data);
    setDisplayTable(false);
    setEditingRowIndex(rowIndex);
  };

  const handleDeleteService = async (id: string, rowIndex: number) => {
    const res = await deleteService(id);
    if (res.status === 200) {
      toast({
        title: "Completado",
        description: "El servicio fue eliminado",
      });
      if (rowIndex !== undefined) {
        const updatedServices = [...services];
        updatedServices.splice(rowIndex, 1);
        setServices(updatedServices);
      }
    } else {
      toast({
        title: "Error",
        description:
          "Error al intentar eliminar el servicio. Por favor, intente nuevamente",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = (updatedData: Service) => {
    if (editingRowIndex !== null) {
      const updatedServices = [...services];
      updatedServices[editingRowIndex] = Object.assign(
        updatedServices[editingRowIndex],
        {
          key: updatedData.key,
          name: updatedData.name,
          cost: updatedData.cost,
          duration: updatedData.duration,
          salespoints: updatedData.salespoints,
          staff: updatedData.staff,
          updatedAt: Date.now(),
        }
      );
      setServices(updatedServices);
    }
    setDisplayTable(true);
  };

  const columns: ColumnDef<Service>[] = [
    ...([
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "key",
        header: "Código",
      },
      {
        accessorKey: "cost",
        header: "Costo",
      },
      {
        accessorKey: "duration",
        header: "Duración",
      },

      {
        accessorKey: "staff",
        header: "Empleados",
        cell: ({ getValue }) => {
          const staff = getValue() as any[];
          return staff?.map((s, index) =>
            index < staff.length - 1 ? s.staffName + ", " : s.staffName
          );
        },
      },
      {
        accessorKey: "salesPoints",
        header: "Puntos de Venta",
        cell: ({ getValue }) => {
          const salespoints = getValue() as SalesPoint[];
          return salespoints?.map((s, index) =>
            index < salespoints.length - 1 ? s.name + ", " : s.name
          );
        },
      },
    ] as ColumnDef<Service>[]),
    ...commonColumns,
    ...([
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DataTableActions
              onEdit={() => handleEditService(row.original, row.index)}
              onDelete={() => handleDeleteService(row.original.id, row.index)}
            />
          );
        },
      },
    ] as ColumnDef<any>[]),
  ] as ColumnDef<Service>[];

  return (
    <ContentLayout title="Servicios">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Servicios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardContainer>
        {displayTable ? (
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={services} />
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
            {/* <ServiceForm
              service={service}
              updateService={handleUpdateService}
            /> */}
          </div>
        )}
      </CardContainer>
    </ContentLayout>
  );
}
