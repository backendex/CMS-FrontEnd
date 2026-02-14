// import { UserTable } from "@/features/users/components/userTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Filter } from "lucide-react";

export default function UserManagementPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* 1. Header con Título y Botón */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button className="bg-indigo-600">
          <Plus className="w-4 h-4 mr-2" /> Add New User
        </Button>
      </div>

      {/* 2. Filtros y Buscador */}
      <div className="flex justify-end gap-2">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input placeholder="Search..." className="pl-8" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {/* 3. La Tabla (El archivo que generamos antes) */}
      {/* <UserTable users={mockUsers} /> */}
    </div>
  );
}