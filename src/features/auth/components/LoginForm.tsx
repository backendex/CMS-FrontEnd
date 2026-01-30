import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { login } from "../api/auth.api"
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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    console.log("SUBMIT PRESIONADO")

    try {
      console.log("ENVIANDO LOGIN:", {
        Email: email,
        Password: password,
      }) 

      const res = await login({
        Email: email,
        Password: password,
      })

      console.log("LOGIN RESPONSE:", res)

      localStorage.setItem("token", res.token)
      localStorage.setItem(
        "mustChangePassword",
        res.mustChangePassword ? "true" : "false"
      )
      console.log("ANTES DE NAVEGAR, PATH ACTUAL:", window.location.pathname)
      if (res.mustChangePassword) {
        navigate("/changePass", { replace: true })
      } else {
        //Despues de loguearse y cambiar password redirecciona a site para empezar a gestionar las paginas
        console.log("REDIRECCIONANDO A /site")
        navigate("/site", { replace: true })
      }

       setTimeout(() => {
       console.log("DESPUÉS DE NAVEGAR, PATH:", window.location.pathname)
      }, 100)
    } catch (err) {
      console.error(err)
      setError("Credenciales inválidas o cuenta deshabilitada")
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
          <p className="text-muted-foreground text-sm">
            Enter your email below to login
          </p>
        </div>

        {error && (
          <p className="text-sm font-medium text-destructive text-center bg-destructive/10 py-2 rounded-md">
            {error}
          </p>
        )}

        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input
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
