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
import { User, UserRole } from "@/models/user.model";
import { DataTableActions } from "@/components/ui/data-table-actions";
import FormUser from "@/components/user/form-user/form-user";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { deleteUser } from "@/api/client";

export default function UsersPage() {
  const data: any = useLoaderData();
  const { toast } = useToast();
  const [displayTable, setDisplayTable] = useState(true);
  const [user, setUser] = useState<User | undefined>(undefined);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    setUsers(data.data);
  }, [data]);

  const handleEditUser = (data: User, rowIndex: number) => {
    setUser(data);
    setDisplayTable(false);
    setEditingRowIndex(rowIndex);
  };

  const handleDeleteUser = async (id: string, rowIndex: number) => {
    const res = await deleteUser(id);
    if (res.status === 200) {
      toast({
        title: "Completado",
        description: "El usuario fue eliminado",
      });
      if (rowIndex !== undefined) {
        const updatedUsers = [...users];
        updatedUsers.splice(rowIndex, 1);
        setUsers(updatedUsers);
      }
    } else {
      toast({
        title: "Error",
        description:
          "Error al intentar eliminar el usuario. Por favor, intente nuevamente",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUser = (updatedData: User) => {
    if (editingRowIndex !== null) {
      const updatedUsers = [...users];
      updatedUsers[editingRowIndex] = Object.assign(
        updatedUsers[editingRowIndex],
        {
          name: updatedData.name,
          email: updatedData.email,
          role: updatedData.role,
          updatedAt: Date.now(),
        }
      );
      setUsers(updatedUsers);
    }
    setDisplayTable(true);
  };

  const columns: ColumnDef<User>[] = [
    ...([
      {
        accessorKey: "name",
        header: "Nombre",
      },
      {
        accessorKey: "email",
        header: "Correo Electrónico",
      },
      {
        accessorKey: "role",
        header: "Rol",
        cell: ({ getValue }) => {
          const role = getValue() as UserRole;
          switch (role) {
            case UserRole.SUPERADMIN:
              return "Administrador de BarberUY";
            case UserRole.ADMIN:
              return "Administrador";
            case UserRole.CLIENT:
              return "Cliente";
            case UserRole.STAFF:
              return "Empleado";
          }
        },
      },
    ] as ColumnDef<User>[]),
    ...commonColumns,
    ...([
      {
        id: "actions",
        cell: ({ row }) => {
          return (
            <DataTableActions
              onEdit={() => handleEditUser(row.original, row.index)}
              onDelete={() => handleDeleteUser(row.original.id, row.index)}
            />
          );
        },
      },
    ] as ColumnDef<any>[]),
  ] as ColumnDef<User>[];

  return (
    <ContentLayout title="Usuarios">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Inicio</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Usuarios</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardContainer>
        {displayTable ? (
          <div className="container mx-auto py-10">
            <DataTable columns={columns} data={users} />
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
            <FormUser user={user} updateUser={handleUpdateUser} />
          </div>
        )}
      </CardContainer>
    </ContentLayout>
  );
}
