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
import { addUser, editUser } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserRole } from "@/models/user.model";
import { useState } from "react";

const FormUser = (props: { user?: User; updateUser?: any }) => {
  const { toast } = useToast();
  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.user);

  const formSchema = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: isEditForm ? z.string().optional() : z.string(),
      confirmPassword: isEditForm ? z.string().optional() : z.string(),
      role: z.nativeEnum(UserRole),
    })
    .superRefine(({ confirmPassword, password }, ctx) => {
      if (confirmPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "Las contraseñas no coinciden",
          path: ["confirmPassword"],
        });
      }
    });

  const defaultValues = isEditForm
    ? props.user
    : {
        name: "",
        email: "",
        role: UserRole.STAFF,
        password: "",
        confirmPassword: "",
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
      } el usuario. Por favor, intente nuevamente`,
      variant: "destructive",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res: any;
    let successStatus = 201;
    if (isEditForm) {
      successStatus = 200;
      res = await editUser(props.user?.id, values).catch(() =>
        handleUserError()
      );
    } else {
      res = await addUser(values).catch(() => handleUserError());
    }
    if (res.status === successStatus) {
      form.reset();
      toast({
        title: "Completado",
        description: `El usuario fue ${isEditForm ? "editado" : "creado"}`,
      });
      if (isEditForm) props.updateUser(values);
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
              <FormLabel>Nombre Completo</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Alberto Machado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="usuario@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar el rol del usuario a crear" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="STAFF">Empleado</SelectItem>
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
