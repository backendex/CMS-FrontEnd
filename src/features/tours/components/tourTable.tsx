import { 
  Edit, 
  Trash2, 
  Plus, 
  Search, 
  Eye, 
  EyeOff, 
  MoreHorizontal 
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

// Mock de datos para testear la vista (Luego vendrán de Postgres vía C#)
const MOCK_TOURS = [
  {
    id: "t1",
    name: "ATV & Cenote Adventure",
    price: 85,
    status: "active",
    image: "https://via.placeholder.com/50", // Aquí iría el link de Cloudinary
    category: "Adventure"
  },
  {
    id: "t2",
    name: "Snorkeling with Turtles",
    price: 65,
    status: "active",
    image: "https://via.placeholder.com/50",
    category: "Water"
  },
  {
    id: "t3",
    name: "Zip Line Canopy",
    price: 120,
    status: "inactive",
    image: "https://via.placeholder.com/50",
    category: "Adventure"
  }
];

export function ToursTable() {
  return (
    <div className="space-y-4">
      {/* Barra de Herramientas Superior */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tour por nombre..."
            className="pl-8"
          />
        </div>
        <Button className="bg-primary">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Tour
        </Button>
      </div>

      {/* Tabla de Datos */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagen</TableHead>
              <TableHead>Nombre del Tour</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {MOCK_TOURS.map((tour) => (
              <TableRow key={tour.id} className="hover:bg-muted/50 transition-colors">
                <TableCell>
                  <img 
                    src={tour.image} 
                    alt={tour.name} 
                    className="w-12 h-12 rounded-lg object-cover border" 
                  />
                </TableCell>
                <TableCell className="font-medium">{tour.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{tour.category}</Badge>
                </TableCell>
                <TableCell>${tour.price} USD</TableCell>
                <TableCell>
                  <Badge 
                    variant={tour.status === 'active' ? 'default' : 'destructive'}
                    className={tour.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {tour.status === 'active' ? 'Publicado' : 'Borrador'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Editar Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        {tour.status === 'active' ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                        {tour.status === 'active' ? 'Ocultar en Web' : 'Publicar'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}