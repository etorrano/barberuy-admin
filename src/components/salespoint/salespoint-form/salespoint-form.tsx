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
  addSalesPoint,
  editSalesPoint,
  getStaff,
  getWorkshifts,
} from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { CreateSalesPointPayload, SalesPoint } from "@/models/salespoint.model";
import { MultiSelect } from "@/components/ui/multi-select";

const formSchema = z.object({
  name: z.string(),
  street: z.string(),
  streetNumber: z.string(),
  floor: z.string().optional(),
  staff: z.array(z.string()),
  workshifts: z.array(z.string()),
});

const SalesPointForm = (props: {
  salespoint?: SalesPoint;
  updateSalesPoint?: any;
}) => {
  const { toast } = useToast();
  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.salespoint);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [staffOptions, setStaffOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedWorkshifts, setSelectedWorksifts] = useState<string[]>([]);
  const [workshiftsOptions, setWorkshiftsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      street: "",
      streetNumber: "",
      floor: "",
      staff: [],
      workshifts: [],
    },
  });

  useEffect(() => {
    const fetchStaffAndWorkshifts = async () => {
      try {
        const staffArray = (await getStaff())?.data;
        const workshiftsArray = (await getWorkshifts())?.data;

        setStaffOptions(
          staffArray?.map((s) => ({ label: s.name, value: s.id.toString() }))
        );
        let selectedStaff: string[] = [];
        if (props.salespoint?.staff) {
          selectedStaff = props.salespoint.staff.map((s) => s.id.toString());
          setSelectedStaff(selectedStaff);
        }

        setWorkshiftsOptions(
          workshiftsArray?.map((w) => ({
            label: w.title,
            value: w.id.toString(),
          }))
        );

        let selectedWorkshifts: string[] = [];
        if (props.salespoint?.workshifts) {
          selectedWorkshifts = props.salespoint.workshifts?.map((s) =>
            s.id.toString()
          );
          if (selectedWorkshifts) {
            setSelectedWorksifts(selectedWorkshifts);
          }
        }
        form.reset({
          ...props.salespoint,
          staff: selectedStaff,
          workshifts: selectedWorkshifts,
          floor: props.salespoint?.floor || "",
        });
      } catch (error) {
        console.error("Failed to fetch staff and workshifts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffAndWorkshifts();
  }, [props.salespoint, form]);

  if (loading) return <p>Loading...</p>;

  const handleSalesPointError = () => {
    toast({
      title: "Error",
      description: `Error al intentar ${
        isEditForm ? "editar" : "crear"
      } el punto de venta. Por favor, intente nuevamente`,
      variant: "destructive",
    });
  };

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    let res: any;
    let successStatus = 201;
    const values: CreateSalesPointPayload = {
      ...formValues,
      ...{ companyId: 1 },
      ...{ staff: formValues.staff.map((s) => ({ id: Number(s) })) },
      ...{ workshifts: selectedWorkshifts.map((s) => ({ id: Number(s) })) },
    };

    if (isEditForm) {
      successStatus = 200;
      res = await editSalesPoint(props.salespoint?.id, values).catch(() =>
        handleSalesPointError()
      );
    } else {
      res = await addSalesPoint(values).catch(() => handleSalesPointError());
    }
    if (res.status === successStatus) {
      form.reset();
      toast({
        title: "Completado",
        description: `El punto de venta fue ${
          isEditForm ? "editado" : "creado"
        }`,
      });
      if (isEditForm) props.updateSalesPoint(res.data);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Calle</FormLabel>
              <FormControl>
                <Input placeholder="Bvar Artigas" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="streetNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Puerta</FormLabel>
              <FormControl>
                <Input placeholder="2024 BIS" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="floor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Apartamento (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="14" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="staff"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar Empleados</FormLabel>
              <FormControl>
                <MultiSelect
                  options={staffOptions}
                  onValueChange={setSelectedStaff}
                  defaultValue={selectedStaff}
                  placeholder="Seleccionar Empleados"
                  variant="inverted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="workshifts"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar turnos de trabajo</FormLabel>
              <FormControl>
                <MultiSelect
                  options={workshiftsOptions}
                  onValueChange={setSelectedWorksifts}
                  defaultValue={selectedWorkshifts}
                  placeholder="Seleccionar turnos"
                  variant="inverted"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default SalesPointForm;
