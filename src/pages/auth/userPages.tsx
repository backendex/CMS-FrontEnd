/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useCallback } from "react"; // 1. Agregamos useCallback por buena práctica
import { Link, useParams } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
//import { UserTable } from "@/features/users/components/userTable";
import { getUsers } from "@/features/auth/api/auth.api";
import { User } from "@/features/auth/types/authType"
import { UserTable } from "@/features/users/components/userTable";

export default function UsersPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    if (!siteId || siteId === "undefined") return;
    try {
      setLoading(true);
      console.log(`Iniciando petición para el sitio: ${siteId}`);

      const response = await getUsers(siteId);
      setUsers(response);
    } catch (error: any) {
      console.error("Error en la carga:", error);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  if (!siteId) return <p>Cargando contexto del sitio...</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Administra los accesos y roles.
          </p>
        </div>
        <Button asChild>
          {/* Construimos la ruta relativa al dashboard del sitio actual */}
          <Link to={`/dash/${siteId}/users/new`} className="flex items-center">
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
