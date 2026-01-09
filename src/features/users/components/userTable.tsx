import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2 } from "lucide-react";

// 1. Datos de ejemplo (Mock Data) basados en tu imagen
const users = [
  {
    id: "1",
    name: "Floyd Miles",
    email: "floydmiles@example.com",
    role: "UI UX Designer",
    status: "Active",
    lastModified: "5 mins ago",
    lastLogin: "5 mins ago",
    avatar: "https://i.pravatar.cc/150?u=floyd",
  },
  {
    id: "2",
    name: "Jane Cooper",
    email: "janecooper@example.com",
    role: "Front Developer",
    status: "In Active",
    lastModified: "15 mins ago",
    lastLogin: "15 mins ago",
    avatar: "https://i.pravatar.cc/150?u=jane",
  },
  {
    id: "3",
    name: "Dianne Russell",
    email: "diannerussell@example.com",
    role: "Backend Developer",
    status: "To Be Verified",
    lastModified: "1 day ago",
    lastLogin: "1 day ago",
    avatar: "https://i.pravatar.cc/150?u=dianne",
  },
];

// 2. Helper para los colores de los estados
const getStatusStyles = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-700 hover:bg-green-100 border-none px-3 py-1";
    case "In Active":
      return "bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1";
    case "To Be Verified":
      return "bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-3 py-1";
    case "On Hold":
      return "bg-slate-100 text-slate-700 hover:bg-slate-100 border-none px-3 py-1";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export function UserTable() {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/50">
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">
              <Checkbox />
            </TableHead>
            <TableHead className="font-semibold text-slate-700">User</TableHead>
            <TableHead className="font-semibold text-slate-700">Role</TableHead>
            <TableHead className="font-semibold text-slate-700">Status</TableHead>
            <TableHead className="font-semibold text-slate-700">Last Modified</TableHead>
            <TableHead className="font-semibold text-slate-700">Last Login</TableHead>
            <TableHead className="text-right pr-8 font-semibold text-slate-700">Actions</TableHead>
          </TableRow>
        </TableHeader>
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
                    <AvatarFallback className="bg-indigo-50 text-indigo-700">
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600">{user.role}</TableCell>
              <TableCell>
                <Badge className={`${getStatusStyles(user.status)} flex w-fit items-center gap-1.5 rounded-md`}>
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {user.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-slate-500">{user.lastModified}</TableCell>
              <TableCell className="text-sm text-slate-500">{user.lastLogin}</TableCell>
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

      {/* Footer de Paginación (Opcional, pero estaba en tu imagen) */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <Button variant="outline" size="sm" className="text-slate-600">
          Previous
        </Button>
        <div className="flex items-center gap-2">
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "default" : "ghost"}
              size="sm"
              className={page === 1 ? "bg-indigo-600" : "text-slate-600"}
            >
              {page.toString().padStart(2, '0')}
            </Button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="text-slate-600">
          Next
        </Button>
      </div>
    </div>
  );
}