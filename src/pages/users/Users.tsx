import React from "react";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import FormUser from "@/components/form-user/form-user";
import CardContainer from "@/components/layout/card-container/card-container";

export default function UsersPage() {
  return (
    <AdminPanelLayout>
    <ContentLayout title="Users">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/">Home</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="/dashboard">Dashboard</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardContainer>
        <FormUser/>
      </CardContainer>
    </ContentLayout>
    </AdminPanelLayout>
  );
}