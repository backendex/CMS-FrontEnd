import { useState } from "react"
import { useNavigate } from "react-router-dom" // 1. Importar el hook
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react" // Para un botón de volver manual

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate() // 2. Inicializar navegación

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulación de guardado
    setTimeout(() => {
      setLoading(false)
      // 3. Retornar a la lista de usuarios
      navigate("/users") 
    }, 1500)
  }

  return (
    <div className="mx-auto space-y-4">
      {/* Botón opcional para volver sin registrar */}
      <Button 
        variant="ghost" 
        onClick={() => navigate("/users")} 
        className="group"
      >
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
            {/* ... Tus inputs de Nombre y Apellido ... */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">Nombre</Label>
                <Input id="first-name" placeholder="Ej. Juan" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Apellido</Label>
                <Input id="last-name" placeholder="Ej. Pérez" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input id="email" type="email" placeholder="juan@ejemplo.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol del Usuario</Label>
              <Select defaultValue="viewer">
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="viewer">Lector</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña Temporal</Label>
              <Input id="password" type="password" required />
            </div>

            <div className="flex gap-3 pt-2">
              {/* Botón Secundario para cancelar */}
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => navigate("/users")}
              >
                Cancelar
              </Button>
              
              {/* Botón Principal */}
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading ? "Registrando..." : "Crear Usuario"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}