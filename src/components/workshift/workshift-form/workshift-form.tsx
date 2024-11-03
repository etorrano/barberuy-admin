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
import { addWorkshift, editWorkshift } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { Days, Workshift } from "@/models/workshift.model";
import { MultiSelect } from "@/components/ui/multi-select";
import { useState } from "react";

export const daysOptions = [
  { value: Days.MONDAY, label: "Lunes" },
  { value: Days.TUESDAY, label: "Martes" },
  { value: Days.WEDNESDAY, label: "Miércoles" },
  { value: Days.THURSDAY, label: "Jueves" },
  { value: Days.FRIDAY, label: "Viernes" },
  { value: Days.SATURDAY, label: "Sábado" },
  { value: Days.SUNDAY, label: "Domingo" },
];

const formSchema = z.object({
  days: z.array(z.nativeEnum(Days)),
  startTime: z.string(),
  endTime: z.string(),
});

const WorkshiftForm = (props: {
  workshift?: Workshift;
  updateWorkshift?: any;
}) => {
  const { toast } = useToast();
  const [isEditForm, setIsEditForm] = useState<boolean>(!!props.workshift);

  const [selectedDays, setSelectedDays] = useState<string[]>([
    Days.MONDAY,
    Days.TUESDAY,
    Days.WEDNESDAY,
    Days.THURSDAY,
    Days.FRIDAY,
  ]);

  const defaultValues = isEditForm
    ? props.workshift
    : {
        days: selectedDays as Days[],
        startTime: "09:00",
        endTime: "18:00",
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
      } el turno. Por favor, intente nuevamente`,
      variant: "destructive",
    });
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    let res: any;
    let successStatus = 201;
    if (isEditForm) {
      successStatus = 200;
      res = await editWorkshift(props.workshift?.id, values).catch(() =>
        handleWorkshiftError()
      );
    } else {
      res = await addWorkshift(values).catch(() => handleWorkshiftError());
    }
    if (res.status === successStatus) {
      form.reset();
      toast({
        title: "Completado",
        description: `El turno fue ${isEditForm ? "editado" : "creado"}`,
      });
      if (isEditForm) props.updateWorkshift(values);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Seleccionar días</FormLabel>
              <FormControl>
                <MultiSelect
                  options={daysOptions}
                  onValueChange={setSelectedDays}
                  defaultValue={selectedDays}
                  placeholder="Seleccionar días"
                  variant="inverted"
                  maxCount={7}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario de Inicio</FormLabel>
              <FormControl className="w-20">
                <Input aria-label="Time" type="time" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario de Finalización</FormLabel>
              <FormControl className="w-20">
                <Input aria-label="Time" type="time" {...field} />
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

export default WorkshiftForm;
