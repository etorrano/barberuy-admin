("use client");

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { useEffect, useState } from "react";
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
  /* const [salespointsStaff, setSalespointsStaff] = useState<
    { id: number; name: string }[]
  >([]); */
  //const [allStaffOptions, setAllStaffOptions] = useState<{ id: number, name: string }[]>([]);

  /*   useEffect(() => {
    const formSalesPointsStaff = form?.getValues()?.salesPointsStaff;
    if (formSalesPointsStaff?.length === 0) {
      props?.salespoints?.map((salespoint) =>
        append({ salesPointId: salespoint.id, salesPointStaff: [] })
      );
    } else {
      selectedSalesPoints?.forEach((salesPoint) => {
        const salesPointStaff = formSalesPointsStaff.find(
          (s) => s.salesPointId === +salesPoint
        );
      });
    }
  }, [selectedSalesPoints]); */

  const formSchema = z.object({
    key: z.string(),
    name: z.string(),
    cost: z.number(),
    duration: z.number(),
    salespoints: z.array(z.string()),
    salesPointsStaff: z.array(
      z.object({
        salesPointId: z.number(),
        salesPointStaff: z.array(z.string()),
      })
    ),
  });
  type FormValues = z.infer<typeof formSchema>;

  const salesPointsStaff: FormValues["salesPointsStaff"] = [];

  props.service?.staff?.forEach((staffService) => {
    const salesPoint = salesPointsStaff.find(
      (s) => s.salesPointId === staffService.salesPointId
    );
    if (salesPoint) {
      salesPoint.salesPointStaff.push(staffService.staffId.toString());
    } else {
      salesPointsStaff.push({
        salesPointId: staffService.salesPointId,
        salesPointStaff: [staffService.staffId.toString()],
      });
    }
  });

  const defaultValues = isEditForm
    ? {
        ...props.service,
        duration:
          (props.service?.duration && props.service?.duration / 60000) || 0,
        salespoints: selectedSalesPoints || [],
        salesPointsStaff: salesPointsStaff,
      }
    : {
        key: "",
        name: "",
        cost: 0,
        duration: 0,
        salespoints: [],
        salesPointsStaff: [],
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "salesPointsStaff",
  });

  const salesPointsValueChangeHandler = (newSalesPointsValue: any[]) => {
    const formSalesPointsStaff = form?.getValues()?.salesPointsStaff;
    if (formSalesPointsStaff?.length === 0) {
      props?.salespoints?.map((salespoint) =>
        append({ salesPointId: +salespoint.id, salesPointStaff: [] })
      );
    } else {
      setSelectedSalesPoints(newSalesPointsValue);
      formSalesPointsStaff.forEach((formValue, index) => {
        if (
          newSalesPointsValue.indexOf(formValue.salesPointId.toString()) === -1
        )
          remove(index);
      });
      newSalesPointsValue.forEach(
        (salesPoint: { label: string; value: string }) => {
          if (!formSalesPointsStaff.find((s) => s.salesPointId === +salesPoint))
            append({ salesPointId: +salesPoint.value, salesPointStaff: [] });
        }
      );
    }
  };

  const salesPointsStaffValueChangeHandler = (
    newSalesPointsStaffValue: any[],
    field: {
      salesPointId: number;
      salesPointStaff: string[];
    }
  ) => {
    field.salesPointStaff = newSalesPointsStaffValue;
  };

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
    /* let res: any;
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
    } */
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
              <FormLabel>Costo (Pesos)</FormLabel>
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
              <FormLabel>Duración (Horas)</FormLabel>
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
                  onValueChange={(value) =>
                    salesPointsValueChangeHandler(value)
                  }
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

        {fields.map((salespointsField, index) => {
          const salespoint = props.salespoints?.find(
            (s) => +s.id === salespointsField.salesPointId
          );
          return (
            salespoint &&
            salespoint.staff &&
            salespoint.staff.length > 0 && (
              <FormField
                key={`key-salesPointsStaff-${salespoint.id}`}
                control={form.control}
                name={`salesPointsStaff.${index}`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Seleccionar Empleados para {salespoint.name}
                    </FormLabel>
                    <FormControl>
                      <MultiSelect
                        options={
                          salespoint.staff?.map((s) => ({
                            label: s.userName,
                            value: s.userId.toString(),
                          })) || [{ label: "", value: "" }]
                        }
                        onValueChange={(value) =>
                          salesPointsStaffValueChangeHandler(
                            value,
                            salespointsField
                          )
                        }
                        defaultValue={salespointsField.salesPointStaff}
                        placeholder="Seleccionar Empleados"
                        variant="inverted"
                        {...field}
                        value={salespointsField.salesPointStaff}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )
          );
        })}
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default ServiceForm;
