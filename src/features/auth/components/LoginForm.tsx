import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { login } from "../api/auth.api" // Asegúrate de que la ruta sea correcta
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  // 1. Estados para el formulario
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // 2. Lógica de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await login({ email, password })

      // Guardamos el token en el almacenamiento local
      localStorage.setItem("token", res.token)

      // 3. Verificación de contraseña temporal
      // El backend debe devolver un flag como 'isTemporary'
      if (res.user?.isTemporaryPassword) {
        // Si es temporal, lo mandamos a la pantalla de cambio obligatorio
        navigate("/change-password", { state: { email } })
      } else {
        // Si es un usuario antiguo, va directo al dashboard
        navigate("/dash")
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    } catch (err: any) {
      setError("Invalid credentials or account not activated.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Mostrar error si existe */}
        {error && (
          <p className="text-sm font-medium text-destructive text-center bg-destructive/10 py-2 rounded-md">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input 
            id="email" 
            type="email" 
            placeholder="m@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </Field>

        <Field>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}