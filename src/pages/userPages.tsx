/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from "react"; // 1. Agregamos useCallback por buena práctica
import { Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { UserTable } from "@/features/users/components/userTable"; 
import { getUsers, User } from "@/features/users/api/users.api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);

  // Definimos la función de carga
  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Iniciando petición a la API...");
      
      const response = await getUsers();
      console.log("Datos recibidos:", response);

      setUsers(response);
    } catch (error: any) {
      console.error("Error en la carga:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. EL CAMBIO CLAVE: Llamar a la función dentro del useEffect
  useEffect(() => {
    loadUsers(); // <--- Faltaba esta línea para que se ejecute al cargar la página
  }, [loadUsers]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">Administra los accesos y roles.</p>
        </div>       
        <Button asChild>
          <Link to="/users/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Usuario
          </Link>
        </Button>
      </div>
      <div className="rounded-md border bg-white p-4">
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <UserTable users={users} />
        )}
      </div>
    </div>
  );
}