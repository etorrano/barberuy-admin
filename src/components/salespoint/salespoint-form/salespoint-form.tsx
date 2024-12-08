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
import { addSalesPoint, editSalesPoint, getStaff } from "@/api/client";
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
});

const SalesPointForm = (props: {
  salespoint?: SalesPoint;
  updateSalesPoint?: any;
}) => {
  const { toast } = useToast();
  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.salespoint);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [staffOptions, setStaffOptions] = useState<{ label: string, value: string }[]>([]);
  const [loading, setLoading] = useState(true); // Track loading state

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      street: "",
      streetNumber: "",
      floor: "",
      staff: [],
    },
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const staffArray = (await getStaff())?.data;
        console.log("Fetched Staff:", staffArray);
        setStaffOptions(staffArray?.map((s) => ({ label: s.name, value: s.id.toString() })));
        if (props.salespoint?.staff) {
          const selected = props.salespoint.staff.map((s) => s.id.toString());
          setSelectedStaff(selected);
          form.reset({
            ...props.salespoint,
            staff: selected,
          });
        }
      } catch (error) {
        console.error("Failed to fetch staff:", error);
      } finally {
        setLoading(false); // Fetch completed
      }
    };

    fetchStaff();
  }, [props.salespoint, form]);

  if (loading) return <p>Loading...</p>;
  /* useEffect(() => {
    setSelectedStaff(props?.salespoint?.staff?.map(s => s.id.toString()) || []);
  }, [props.salespoint]); */

/*   const defaultValues = isEditForm
    ? { ...props.salespoint, ...{ floor: props?.salespoint?.floor || '',staff: selectedStaff } }
    : {
        name: "",
        street: "",
        streetNumber: "",
        floor: "",
        staff: selectedStaff,
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (props.salespoint?.staff) {
      const selectedStaff = props.salespoint.staff.map((s) => s.id.toString());
      setSelectedStaff(selectedStaff);
      form.setValue("staff", props.salespoint.staff.map((s) => s.id.toString())); // Sync form state
    }
  }, [props.salespoint, form]);

  useEffect(() => {
    const fetchStaff = async () => {
      const staffArray = (await getStaff())?.data;
      console.log(staffArray)
      setStaffOptions(staffArray?.map(s => ({ label: s.name, value: s.id.toString() })));
    };
    fetchStaff();
  }, []); */

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
      ...{ staff: formValues.staff.map(s => ({ id: Number(s)}))},
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
      if (isEditForm) props.updateSalesPoint(values);
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

        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default SalesPointForm;
