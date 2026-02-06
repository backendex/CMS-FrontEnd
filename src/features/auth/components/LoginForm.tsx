import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { login } from "../api/auth.api";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("ENVIANDO LOGIN:", { email, password });

      const res = await login({
        email,
        password,
      });

      console.log("LOGIN RESPONSE RECIBIDA:", res);

      if (res && res.token) {
        localStorage.setItem("token", res.token);
        localStorage.removeItem("activeSiteId");
        
        const mustChangeStr = res.mustChangePassword ? "true" : "false";
        localStorage.setItem("mustChangePassword", mustChangeStr);

        if (res.userId) {
          localStorage.setItem("userId", res.userId.toString());
        }

        console.log("DATOS GUARDADOS EN STORAGE:", {
          token: !!localStorage.getItem("token"),
          mustChange: localStorage.getItem("mustChangePassword")
        });

        if (res.mustChangePassword) {
          navigate("/changePass", { replace: true });
        } else {
          navigate("/site", { replace: true });
        }
      } else {
        setError("Error: El servidor no devolvió un token válido.");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("ERROR EN LOGIN:", err);
      setError(err.response?.data?.message || "Credenciales inválidas o cuenta deshabilitada");
    } finally {
      setLoading(false);
    }
  };

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
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel>Password</FieldLabel>
          </div>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </Field>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </FieldGroup>
    </form>
  );
}