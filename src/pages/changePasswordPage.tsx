import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // El hook debe estar en el nivel superior
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useToast } from "@/components/ui/use-toast";
import { changePassword } from "@/features/users/api/users.api";
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

const formSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default function ChangePasswordPage() {
  // 1. TODOS los hooks se llaman al principio, siempre, sin condiciones.
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    toast({
      title: "Acceso restringido",
      description: "Por seguridad, debe cambiar su contraseña temporal.",
    });
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
  setLoading(true);
  try {
    await changePassword({
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    });
    
    localStorage.removeItem("token");
    localStorage.removeItem("mustChangePassword");

    toast({
      title: "¡Éxito!",
      description: "Contraseña actualizada. Por favor, inicie sesión con su nueva clave.",
    });

    navigate("/login", { replace: true });
  } 
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   catch (error: any) {
      // Imprime esto en la consola para ver el detalle real
      console.error("Detalle del error:", error.response?.data);

      toast({
        variant: "destructive",
        title: "Error",
        description: error.response?.data?.message || "Error al actualizar.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-[400px] rounded-xl border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-2xl font-bold">Cambiar contraseña</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
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
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
