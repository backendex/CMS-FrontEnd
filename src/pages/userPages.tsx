import { Link } from "react-router-dom"
import { Plus } from "lucide-react" // Iconos
import { Button } from "@/components/ui/button"
export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Cabecera de la vista */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los accesos y roles de tu personal.
          </p>
        </div>
        
        {/* BOTÓN DE ACCIÓN */}
        <Button asChild>
          <Link to="/users/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Link>
        </Button>
      </div>

      {/* Aquí va tu tabla actual de usuarios */}
      <div className="rounded-md border bg-white">
        {/* <Table> ... </Table> */}
      </div>
    </div>
  )
}


// ... tus otras importaciones (Table, etc)

