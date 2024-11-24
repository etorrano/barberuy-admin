("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "@/config/zod/zod-es";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addService, editService } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Service } from "@/models/service.model";
import { SalesPoint } from "@/models/salespoint.model";
import { MultiSelect } from "@/components/ui/multi-select";

const ServiceForm = (props: {
  service?: Service;
  salespoints: SalesPoint[];
  updateService?: any;
}) => {
  const { toast } = useToast();

  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.service);
  const [selectedSalesPoints, setSelectedSalesPoints] = useState<string[]>(
    Array.from(
      new Set(props?.service?.staff?.map((s) => s.salesPointId.toString()))
    ) || []
  );
  const [selectedStaff, setSelectedStaff] = useState<string[]>(
    Array.from(
      new Set(props?.service?.staff?.map((s) => s.staffId.toString()))
    ) || []
  );

  const formSchema = z.object({
    key: z.string(),
    name: z.string(),
    cost: z.number(),
    duration: z.number(),
    salespoints: z.array(z.string()),
    staff: z.array(z.string()),
  });

  const defaultValues = isEditForm
    ? {
        ...props.service,
        salespoints: selectedSalesPoints || [],
        staff: selectedStaff || [],
      }
    : {
        key: "",
        name: "",
        cost: 0,
        duration: 0,
        salespoints: [],
        staff: [],
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleUserError = () => {
    toast({
      title: "Error",
      description: `Error al intentar ${
        isEditForm ? "editar" : "crear"
      } el servicio. Por favor, intente nuevamente`,
      variant: "destructive",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res: any;
    let successStatus = 201;
    const mapValues = {
      ...values,
      salespoints: values.salespoints.map((s) => Number(s)),
      staff: values.staff.map((s) => Number(s)),
    };
    if (isEditForm) {
      successStatus = 200;
      res = await editService(props.service?.id, mapValues).catch(() =>
        handleUserError()
      );
    } else {
      res = await addService(mapValues).catch(() => handleUserError());
    }
    if (res.status === successStatus) {
      form.reset();
      toast({
        title: "Completado",
        description: `El servicio fue ${isEditForm ? "editado" : "creado"}`,
      });
      if (isEditForm) props.updateService(values);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Costo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salespoints"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar Punto de Venta</FormLabel>
              <FormControl>
                <MultiSelect
                  options={props?.salespoints?.map((s) => ({
                    label: s.name,
                    value: s.id.toString(),
                  }))}
                  onValueChange={setSelectedSalesPoints}
                  defaultValue={selectedSalesPoints}
                  placeholder="Seleccionar Puntos de Venta"
                  variant="inverted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* 
        <FormField
          control={form.control}
          name="staff"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar Punto de Venta</FormLabel>
                <FormControl>                  
                  <MultiSelect
                      options={form.getValues().salespoints.map(salespoint => salespoint.staff?.map((s) => (({
                        label: s.userName,
                        value: s.userId.toString(),
                      })))}
                      onValueChange={setSelectedSalesPoints}
                      defaultValue={selectedSalesPoints}
                      placeholder="Seleccionar Puntos de Venta"
                      variant="inverted"
                      {...field}
                    />
                </FormControl>
                <SelectContent>
                  {props?.salespoints?.map((s) => {
                    return s.staff?.map((staff) => (
                      <SelectItem value={staff.userId.toString()}>
                        {staff.userName}
                      </SelectItem>
                    ));
                  })}
              <FormMessage />
            </FormItem>
          )}
        /> */}
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default ServiceForm;
