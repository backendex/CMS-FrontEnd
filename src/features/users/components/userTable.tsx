import { 
  Table, 
  TableBody, 
  TableCell, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2 } from "lucide-react";

// 1. Datos de ejemplo (Mock Data) basados en tu imagen
// 1. Define la interfaz para que coincida con tu Backend
interface User {
  id: string;
  fullName: string;   // Cambiado de 'name' para coincidir con tu API
  email: string;
  rolId: number;      // Cambiado de 'role' string a ID numérico
  emailConfirmed: boolean; // Usaremos esto para el Status
  avatar?: string;
}

// 2. Define las Props
interface UserTableProps {
  users: User[];
}

// 3. Modifica la función para recibir las props
export function UserTable({ users }: UserTableProps) { // <-- Recibe los datos aquí
  
  // Helper actualizado para usar los datos reales de la base de datos
  const getStatusStyles = (confirmed: boolean) => {
    if (confirmed) {
      return "bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1";
    }
    return "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1";
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <Table>
        {/* ... (TableHeader se mantiene igual) ... */}
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id} className="group hover:bg-slate-50/30 transition-colors">
              <TableCell className="text-center">
                <Checkbox />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-slate-200">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-slate-100 text-slate-900">
                      {user.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm">{user.fullName}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {user.rolId === 1 ? "Administrator" : "User"}
              </TableCell>
              <TableCell>
                <Badge className={`${getStatusStyles(user.emailConfirmed)} flex w-fit items-center gap-1.5 rounded-md`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {user.emailConfirmed ? "Active" : "To Be Verified"}
                </Badge>
              </TableCell>
              {/* Estos campos puedes dejarlos fijos o mapearlos si el backend los envía */}
              <TableCell className="text-sm text-slate-500">Just now</TableCell>
              <TableCell className="text-sm text-slate-500">Recently</TableCell>
              <TableCell className="text-right pr-6">
                <div className="flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-indigo-600">
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* ... (Footer de paginación) ... */}
    </div>
  );
}