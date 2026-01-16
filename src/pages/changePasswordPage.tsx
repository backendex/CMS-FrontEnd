"use client"

import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
// Importamos la función que acabamos de crear
import { changePassword } from "@/features/users/api/users.api"

export default function ChangePasswordPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const email = location.state?.email || ""
  // IMPORTANTE: Recuperamos también la clave temporal que el usuario usó en el Login
  const tempPassword = location.state?.tempPassword || "" 

  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return toast({
        variant: "destructive",
        title: "Error",
        description: "Las contraseñas no coinciden.",
      })
    }

    setLoading(true)

    try {
      // LLAMADA REAL AL BACKEND
      await changePassword({
        email: email,
        currentPassword: tempPassword, // Enviamos la temporal para validar
        newPassword: newPassword
      })

      toast({
        title: "Contraseña actualizada",
        description: "Tu clave ha sido guardada en la base de datos.",
      })

      navigate("/dash")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error al actualizar",
        description: error.response?.data?.message || "Hubo un problema con el servidor.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className={cn("flex flex-col gap-6")}>
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8">
            <div className="flex flex-col items-center gap-2 text-center mb-6">
              <h1 className="text-2xl font-bold">Nueva Clave Permanente</h1>
              <p className="text-balance text-sm text-muted-foreground">
                Configurando acceso para: <br />
                <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <FieldGroup className="grid gap-6">
                <Field>
                  <FieldLabel htmlFor="new-password">Nueva Contraseña</FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="********"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Confirmar Contraseña</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Field>
                
                <Button type="submit" className="w-full mt-2" disabled={loading || !email}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {loading ? "Guardando..." : "Actualizar y Finalizar"}
                </Button>
              </FieldGroup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}