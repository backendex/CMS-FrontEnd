import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { deleteTour } from "@/features/tours/api/tour.api";
import { Tour, ToursTableProps } from "@/features/tours/types/tourType"; 
import { StatusModal, StatusType } from "@/components/ui/status-modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExtendedProps extends ToursTableProps {
  tours: Tour[];
}

export function ToursTable({ siteId, tours }: ExtendedProps) {
  const [list, setList] = useState<Tour[]>(tours);
  
  // Modal State
  const [modal, setModal] = useState<{
    isOpen: boolean;
    type: StatusType;
    title: string;
    description?: string;
    onAction?: () => void;
  }>({
    isOpen: false,
    type: "success",
    title: "",
  });

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  useEffect(() => {
    setList(tours);
  }, [tours]);

  const handleDelete = async (id: string) => {
    setModal({
      isOpen: true,
      type: "warning",
      title: "¿Eliminar tour?",
      description: "Esta acción borrará permanentemente el tour del sistema.",
      onAction: async () => {
        try {
          await deleteTour(id);
          setList(prev => prev.filter((t) => t.id !== id));
          setModal({
            isOpen: true,
            type: "success",
            title: "Eliminado",
            description: "El tour ha sido borrado con éxito."
          });
        } catch (error) {
          setModal({
            isOpen: true,
            type: "error",
            title: "Error",
            description: "No se pudo eliminar el tour."
          });
        }
      }
    });
  };

  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
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
          {list.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No se encontraron tours para este sitio ({siteId}).
              </TableCell>
            </TableRow>
          ) : (
            list.map((tour) => (
              <TableRow key={tour.id}>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900">{tour.name}</span>
                    <span className="text-xs text-muted-foreground">/{tour.slug}</span>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="text-slate-500 hover:text-amber-600"
                    >
                      <Link to={`/dash/${siteId}/tour/edit/${tour.id}`}>                    
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => tour.id && handleDelete(tour.id)}
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

      <StatusModal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        description={modal.description}
        onAction={modal.onAction}
      />
    </div>
  );
}