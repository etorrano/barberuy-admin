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
import { addWorkshift } from "@/api/client";
import { useToast } from "@/hooks/use-toast";
import { Days } from "@/models/workshift.model";

const formSchema = z.object({
  days: z.array(z.nativeEnum(Days)),
  startTime: z.string(),
  endTime: z.string(),
});

const WorkshiftForm = () => {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      days: [Days.MONDAY],
      startTime: "",
      endTime: "",
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
                <Input placeholder="Ej: Alberto Machado" {...field} />
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
              <FormControl>
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
              <FormControl>
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
