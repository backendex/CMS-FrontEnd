import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { createUser } from "@/features/users/api/users.api";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [rolId, setRolId] = useState<number>(2); // default User
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Llamada a la API para crear el usuario
      await createUser({
        name: firstName,
        lastName: lastName,
        email: email,
        rolId: rolId,
      });

      // 2. Notificación de éxito al administrador
      alert(`¡Éxito! Se ha enviado un correo de activación a ${email}`); 

      // 3. Redirección a la tabla de usuarios
      navigate("/users");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // Manejo de errores (401 si el token falla, etc.)
      if (error.response?.status === 401) {
        alert("Sesión de administrador no válida. Por favor, reingresa.");
      } else {
        alert("Error al crear el usuario. Revisa la consola para más detalles.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="mx-auto space-y-4">
      <Button variant="ghost" onClick={() => navigate("/users")} className="group">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Volver a la lista
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo Usuario</CardTitle>
          <CardDescription>
            Crea una nueva cuenta para que alguien acceda al panel.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre / Apellido */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  placeholder="Ej. Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Apellido</Label>
                <Input
                  placeholder="Ej. Pérez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input
                type="email"
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label>Rol del Usuario</Label>
              <Select
                value={rolId.toString()}
                onValueChange={(value) => setRolId(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Administrador</SelectItem>
                  <SelectItem value="2">Usuario</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/users")}
              >
                Cancelar
              </Button>

              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Registrando..." : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
