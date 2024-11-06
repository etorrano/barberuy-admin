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
  addWorkshift,
  editSalesPoint,
  editWorkshift,
} from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";
import { CreateSalesPointPayload, SalesPoint } from "@/models/salespoint.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string(),
  street: z.string(),
  streetNumber: z.string(),
  floor: z.string().optional(),
});

const SalesPointForm = (props: {
  salespoint?: SalesPoint;
  updateSalesPoint?: any;
}) => {
  const { toast } = useToast();
  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.salespoint);

  const defaultValues = isEditForm
    ? props.salespoint
    : {
        name: "",
        street: "",
        streetNumber: "",
        floor: "",
      };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleWorkshiftError = () => {
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
    };

    if (isEditForm) {
      successStatus = 200;
      res = await editSalesPoint(props.salespoint?.id, values).catch(() =>
        handleWorkshiftError()
      );
    } else {
      res = await addSalesPoint(values).catch(() => handleWorkshiftError());
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
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default SalesPointForm;
