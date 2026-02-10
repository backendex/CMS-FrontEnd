import { useEffect, useState } from "react";
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
import { Pencil, Trash2 } from "lucide-react";
import { tourService, Tour } from "../api/tour.api"; //

interface ToursTableProps {
  siteId?: string;
}

export function ToursTable({ siteId }: ToursTableProps) {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadTours = async () => {
    if (!siteId) return;
    try {
      setLoading(true);
      const data = await tourService.getBySite(siteId);
      setTours(data); 
    } catch (error) {
      console.error("Error capturado:", error);

    } finally {
      setLoading(false); 
    }
  };
  loadTours();
}, [siteId]);

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
              <TableCell colSpan={5} className="h-24 text-center">
                No se encontraron tours para este sitio.
              </TableCell>
            </TableRow>
          ) : (
            tours.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{tour.name}</span>
                    <span className="text-xs text-muted-foreground">/{tour.slug}</span>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{tour.category}</TableCell>
                <TableCell>${tour.price}</TableCell>
                <TableCell>
                  <Badge variant={tour.isactive ? "default" : "secondary"}>
                    {tour.isactive ? "Activo" : "Borrador"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
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