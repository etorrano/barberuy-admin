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
import { addWorkshift } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { Days } from "@/models/workshift.model";
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

const WorkshiftForm = () => {
  const { toast } = useToast();
  const [selectedDays, setSelectedDays] = useState<string[]>([
    Days.MONDAY,
    Days.TUESDAY,
    Days.WEDNESDAY,
    Days.THURSDAY,
    Days.FRIDAY,
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: selectedDays as Days[],
      startTime: "09:00",
      endTime: "18:00",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    const res = await addWorkshift(values);
    if (res.status == 201) {
      form.reset();
      toast({
        title: "Completado",
        description: "El turno fue creado",
      });
    } else {
      toast({
        title: "Error",
        description:
          "Error al intentar crear el turno. Por favor, intente nuevamente",
        variant: "destructive",
      });
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
