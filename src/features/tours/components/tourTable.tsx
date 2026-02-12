/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
// Importamos las funciones directamente como en tu servicio de Auth
import { getToursBySite, deleteTour } from "../api/tour.api";
import { Tour } from "@/features/tours/types/tourType"; 

interface ToursTableProps {
  siteId?: string;
}

export function ToursTable({ siteId }: ToursTableProps) {
  console.log("Prop siteId recibida en el componente Tabla:", siteId);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTours = useCallback(async () => {
    if (!siteId) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await getToursBySite(siteId);
      setTours(data);
    } catch (error) {
      console.error("Error en el componente ToursTable:", error);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  
  useEffect(() => {
    loadTours();
  }, [siteId, loadTours]); 


  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este tour?")) return;

    try {
      await deleteTour(id);
      // Actualizamos la lista localmente para no tener que recargar toda la página
      setTours(tours.filter((t) => t.id !== id));
    } catch (error) {
      alert("No se pudo eliminar el tour.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-32 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-white shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Nombre / URL</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tours.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No se encontraron tours para este sitio.
              </TableCell>
            </TableRow>
          ) : (
            tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">
                      {tour.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      /{tour.slug}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{tour.category}</TableCell>
                <TableCell className="font-mono">${tour.price}</TableCell>
                <TableCell>
                  <Badge variant={tour.isActive ? "default" : "secondary"}>
                    {tour.isActive ? "Activo" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Editar tour">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => tour.id && handleDelete(tour.id)}
                      title="Eliminar tour"
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
