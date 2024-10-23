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
import {
  columns,
  WorkshiftsList,
} from "@/components/workshift/workshifts-list/workshifts-list";
import { daysOptions } from "@/components/workshift/workshift-form/workshift-form";
import { Workshift } from "@/models/workshift.model";

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
            <WorkshiftsList columns={columns} data={data.data} />
          </div>
        </CardContainer>
      </ContentLayout>
    </AdminPanelLayout>
  );
}
