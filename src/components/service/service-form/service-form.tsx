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
import { addService, addUser, editService, editUser } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/models/user.model";
import { useState } from "react";

const ServiceForm = (props: { service?: User; updateService?: any }) => {
  const { toast } = useToast();

  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.service);

  const formSchema = z.object({
    key: z.string(),
    name: z.string(),
    cost: z.number(),
    duration: z.number(),
    salespoints: z.array(z.number()),
    staff: z.array(z.number()),
  });

  const defaultValues = isEditForm
    ? props.service
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
    if (isEditForm) {
      successStatus = 200;
      res = await editService(props.service?.id, values).catch(() =>
        handleUserError()
      );
    } else {
      res = await addService(values).catch(() => handleUserError());
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
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar el Punto de Venta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Empleado</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default FormUser;
