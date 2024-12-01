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
import FormUser from "@/components/user/form-user/form-user";
import CardContainer from "@/components/layout/card-container/card-container";
import { Link, useLoaderData } from "react-router-dom";
import ServiceForm from "@/components/service/service-form/service-form";

export default function ServicesFormPage() {
  const data: any = useLoaderData();  
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
            <BreadcrumbLink asChild>
              <Link to="/servicios">Servicios</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Nuevo</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <CardContainer>
      <ServiceForm
        salespoints={data?.data}
      />
      </CardContainer>
    </ContentLayout>
  );
}
