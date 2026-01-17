"use client";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2 } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
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
import { changePassword } from "@/features/users/api/users.api";

// 1. Esquema de Validación: Define las reglas de negocio del formulario
const formSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"], // El error se mostrará en el campo de confirmar
  });

export default function ChangePasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Datos recuperados del login previo
  const email = location.state?.email || "";
  const tempPassword = location.state?.tempPassword || "";

  // 2. Inicialización del Formulario con React Hook Form y Zod
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 3. Función de envío: Solo se ejecuta si Zod valida los datos correctamente
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      await changePassword({
        email: email,
        currentPassword: tempPassword,
        newPassword: values.newPassword,
      });

      toast({
        title: "Éxito",
        description: "Tu contraseña ha sido actualizada correctamente.",
      });

      navigate("/dash");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de servidor",
        description: error.response?.data?.message || "Hubo un fallo en la conexión.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-[450px]">
        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Nueva Clave Permanente</h1>
            <p className="text-sm text-muted-foreground">
              Usuario: <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          {/* 4. Implementación del Contexto de Formulario */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage /> {/* Muestra error de Zod aquí */}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage /> {/* Muestra si las claves no coinciden */}
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={loading || !email || !tempPassword}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Actualizando..." : "Actualizar y Finalizar"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}