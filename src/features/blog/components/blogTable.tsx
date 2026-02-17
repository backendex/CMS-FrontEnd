import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
// Asumiendo que crearás estas funciones en tu blog.api.ts
// import { deleteBlogPost } from "@/features/blog/services/blog.api"; 
import {BlogsTableProps} from "@/features/blog/types/types"
import { BlogPost } from "@/features/blog/types/types"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function BlogsTable({ blogs, onDelete,  siteId, }: BlogsTableProps) {
  const [list, setList] = useState<BlogPost[]>(blogs);

  useEffect(() => {
    setList(blogs);
  }, [blogs]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este post?")) return;
    try {
      // await deleteBlogPost(id);
      if (onDelete) onDelete(id);
      setList(prev => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert("No se pudo eliminar el post.");
    }
  };

  // Función para determinar el color del semáforo SEO (basado en lo que definimos antes)
  const getSeoColor = (score: number) => {
    if (score === 0) return "bg-slate-300";
    if (score < 30) return "bg-red-500";
    if (score < 60) return "bg-orange-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[350px]">Título del Post</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Keyword Principal</TableHead>
            <TableHead>SEO</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No hay artículos de blog publicados.
              </TableCell>
            </TableRow>
          ) : (
            list.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 line-clamp-1">{blog.title}</span>
                    <span className="text-xs text-muted-foreground">/{blog.slug}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <span className="text-sm text-slate-600 uppercase font-semibold">
                      {blog.siteId.split('-')[0]} {/* Muestra 'extreme' de 'extreme-adventure' */}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                    {blog.seoData?.focusKeyword || "N/A"}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getSeoColor(80)}`} /> {/* Ejemplo con 80 */}
                    <span className="text-xs font-medium">Buena</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={blog.isPublished ? "default" : "secondary"}>
                    {blog.isPublished ? "Publicado" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={`/dash/${siteId}/blog/edit`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}