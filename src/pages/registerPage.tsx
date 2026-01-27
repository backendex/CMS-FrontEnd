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
      await createUser({
        name: firstName,
        lastName: lastName,
        email: email,
        rolId: rolId,
        // isDeleted: false, // Podrías agregarlo aquí si tu API ya lo espera
      });

      alert(`¡Éxito! Se ha enviado un correo de activación a ${email}`); 
      navigate("/users");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.response?.status === 401) {
        alert("Sesión de administrador no válida. Por favor, reingresa.");
      } else {
        alert("Error al crear el usuario.");
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    /* MODIFICACIÓN 1: 
       Cambiamos "mx-auto" por "ml-10" (margen izquierdo) o "ml-0" si quieres pegarlo totalmente.
       Añadimos "max-w-2xl" para que el formulario no se estire demasiado a la derecha.
    */
    <div className="ml-10 max-w-2xl space-y-2 pt-2">
      
      {/* MODIFICACIÓN 2: 
         El botón ahora se alineará naturalmente a la izquierda con el Card 
      */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/users")} 
        className="group hover:bg-transparent p-0"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Volver a la lista
      </Button>

      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Nuevo Usuario</CardTitle>
          <CardDescription>
            Crea una nueva cuenta para que alguien acceda al panel.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre</Label>
                <Input
                  id="firstName"
                  placeholder="Ej. Juan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input
                  id="lastName"
                  placeholder="Ej. Pérez"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="juan@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

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

            <div className="flex gap-3 pt-4">
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