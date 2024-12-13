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
import { addUser, editUser, getSalesPoints, getWorkshifts } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { CreateUserPayload, User, UserRole } from "@/models/user.model";
import { useEffect, useState } from "react";
import { MultiSelect } from "@/components/ui/multi-select";

const FormUser = (props: { user?: User; updateUser?: any }) => {
  const { toast } = useToast();
  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.user);
  const [showSalesPoints, setShowSalesPoints] = useState<boolean>(
    props.user?.role === UserRole.STAFF
  );
  const initialSalesPoints =
    props.user?.salesPoints?.map((s) => s.id.toString()) || [];
  const [selectedSalesPoints, setSelectedSalesPoints] =
    useState<string[]>(initialSalesPoints);
  const [salesPointsOptions, setSalesPointsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedWorkshifts, setSelectedWorkshifts] = useState<string[]>([]);
  const [workshiftsOptions, setWorkshiftsOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchSalesPointsAndWorkshifts = async () => {
      try {
        const salesPointsArray = (await getSalesPoints())?.data;
        setSalesPointsOptions(
          salesPointsArray?.map((s) => ({
            label: s.name,
            value: s.id.toString(),
          }))
        );
        let selectedSalesPoints: string[] = [];
        if (props.user?.salesPoints) {
          selectedSalesPoints = props.user?.salesPoints.map((s) =>
            s.id.toString()
          );
          setSelectedSalesPoints(selectedSalesPoints);
        }

        const workshiftsArray = (await getWorkshifts())?.data;
        setWorkshiftsOptions(
          workshiftsArray?.map((s) => ({
            label: s.title,
            value: s.id.toString(),
          }))
        );

        let selectedWorkshifts: string[] = [];
        if (props.user?.workshifts) {
          selectedWorkshifts = props.user?.workshifts?.map((s) =>
            s.id.toString()
          );
          if (selectedWorkshifts) {
            setSelectedWorksifts(selectedWorkshifts);
          }
        }
      } catch (error) {
        console.error("Failed to fetch salespoints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesPointsAndWorkshifts();
  }, []);

  const formSchema = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: isEditForm ? z.string().optional() : z.string(),
      confirmPassword: isEditForm ? z.string().optional() : z.string(),
      role: z.nativeEnum(UserRole),
      salesPoints: z.array(z.string()).optional(),
      workshifts: z.array(z.string()).optional(),
    })
    .superRefine(
      ({ confirmPassword, password, role, salesPoints, workshifts }, ctx) => {
        if (confirmPassword !== password) {
          ctx.addIssue({
            code: "custom",
            message: "Las contraseñas no coinciden",
            path: ["confirmPassword"],
          });
        }
        if (role === UserRole.STAFF) {
          if (!salesPoints || (salesPoints && salesPoints.length < 1)) {
            ctx.addIssue({
              code: "custom",
              message:
                "Se debe elegir al menos un Punto de Venta para el empleado",
              path: ["salesPoints"],
            });
          }
          if (!workshifts || (workshifts && workshifts.length < 1)) {
            ctx.addIssue({
              code: "custom",
              message:
                "Se debe elegir al menos un Punto de Venta para el empleado",
              path: ["salesPoints"],
            });
          }
        }
      }
    );

  const defaultValues = isEditForm
    ? { ...props.user, salesPoints: selectedSalesPoints }
    : {
        name: "",
        email: "",
        role: UserRole.STAFF,
        password: "",
        confirmPassword: "",
        salesPoints: [],
        workshifts: [],
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

  async function onSubmit(formValues: z.infer<typeof formSchema>) {
    let res: any;
    let successStatus = 201;
    const values: CreateUserPayload = {
      ...formValues,
      ...{ salesPoints: selectedSalesPoints.map((s) => ({ id: Number(s) })) },
      ...{ workshifts: selectedWorkshifts.map((s) => ({ id: Number(s) })) },
    };

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
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  console.log(value);
                  console.log(value === UserRole.STAFF);
                  setShowSalesPoints(value === UserRole.STAFF);
                }}
                defaultValue={field.value}
              >
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
        {loading && <p>Loading...</p>}
        {!loading && showSalesPoints && (
          <>
            <FormField
              control={form.control}
              name="salesPoints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar Puntos de Venta</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={salesPointsOptions}
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
            <FormField
              control={form.control}
              name="workshifts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seleccionar turnos de trabajo</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={workshiftsOptions}
                      onValueChange={setSelectedWorkshifts}
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
          </>
        )}
        <Button type="submit">Enviar</Button>
      </form>
    </Form>
  );
};

export default FormUser;
