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
import FormUser from "@/components/user/form-user/form-user";
import CardContainer from "@/components/layout/card-container/card-container";
import { columns, UsersList } from "@/components/user/users-list/users-list";
import { useLoaderData } from "react-router-dom";

export default function UsersPage() {
  const data: any = useLoaderData();
  return (
    <AdminPanelLayout>
      <ContentLayout title="Usuarios">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <a href="/">Inicio</a>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Usuarios</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <CardContainer>
          <div className="container mx-auto py-10">
            <UsersList columns={columns} data={data.data} />
          </div>
        </CardContainer>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
