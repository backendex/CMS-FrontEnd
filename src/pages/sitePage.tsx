import { SiteSelector } from "@/features/sites";
import { SiteType } from "@/features/sites/types/siteType";
import { useEffect, useState } from "react";
import { getMe, createSite, updateSite, deleteSite } from "@/features/sites/api/site.api";
import { useNavigate } from "react-router-dom";
import { useSite } from "@/features/sites/components/siteContext";
import { Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const PRESET_COLORS = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#dc2626", // Red
  "#d97706", // Yellow
  "#7c3aed", // Purple
  "#db2777", // Pink
  "#09090b", // Zinc/Black
];

export default function SitePage() {
  const [sites, setSites] = useState<SiteType[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { setActiveSite } = useSite();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<SiteType | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("");
  const [url, setUrl] = useState("");
  const [color, setColor] = useState("#09090b");
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const fetchSites = () => {
    setLoading(true);
    getMe()
      .then((res) => {
        setSites([...res.allowedSites]);
      })
      .catch((err) => {
        console.error("Error fetching sites", err);
        toast({
          title: "Error",
          description: "No se pudieron cargar los sitios web.",
          variant: "destructive",
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleManage = (site: SiteType) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    if (site.isMaintenance) {
      toast({
        title: "Sitio en Mantenimiento",
        description: "Este sitio se encuentra bajo mantenimiento programado.",
      });
      return;
    }
    setActiveSite(site);
    navigate(`/dash/${site.id}`);
  };

  const handleOpenCreate = () => {
    setEditingSite(null);
    setName("");
    setDomain("");
    setUrl("");
    setColor("#09090b");
    setIsMaintenance(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (site: SiteType) => {
    setEditingSite(site);
    setName(site.name);
    setDomain(site.domain);
    setUrl(site.url || "");
    setColor(site.color || "#09090b");
    setIsMaintenance(site.isMaintenance);
    setIsActive(site.isActive);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !domain) {
      toast({
        title: "Campos requeridos",
        description: "Por favor, ingresa el nombre y el dominio del sitio.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name,
        domain,
        url: url || `https://${domain}`,
        color,
        isMaintenance,
        isActive,
      };

      if (editingSite) {
        await updateSite(editingSite.id, payload);
        toast({
          title: "Sitio actualizado",
          description: "Los cambios se guardaron con éxito.",
        });
      } else {
        await createSite(payload);
        toast({
          title: "Sitio creado",
          description: "El nuevo sitio se ha configurado e inicializado.",
        });
      }
      setIsModalOpen(false);
      fetchSites();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al guardar",
        description: err.response?.data?.message || "Ocurrió un error inesperado al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (site: SiteType) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el sitio "${site.name}"? Esta acción borrará el sitio permanentemente de la plataforma.`)) {
      return;
    }

    try {
      await deleteSite(site.id);
      toast({
        title: "Sitio eliminado",
        description: "El sitio ha sido removido del sistema.",
      });
      fetchSites();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al eliminar",
        description: err.response?.data?.message || "No se pudo eliminar el sitio.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 animate-spin text-black" />
        <p className="mt-4 text-gray-600 font-medium">Cargando sitios...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Ecosistema de Sitios</h1>
            <p className="text-gray-500 mt-1">
              Selecciona un sitio para administrar o crea uno nuevo para tu red.
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
            <Plus size={16} /> Añadir Sitio
          </Button>
        </div>

        {sites.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-lg font-medium text-gray-900">No hay sitios configurados</h3>
            <p className="text-sm text-gray-500 mt-1">Comienza añadiendo tu primer sitio web a la red.</p>
            <Button onClick={handleOpenCreate} className="mt-4 bg-black text-white hover:bg-gray-800">
              <Plus size={16} className="mr-2" /> Añadir Sitio
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sites.map((site) => (
              <SiteSelector
                key={site.id}
                site={site}
                onManage={() => handleManage(site)}
                onEdit={() => handleOpenEdit(site)}
                onDelete={() => handleDelete(site)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editingSite ? "Editar Sitio Web" : "Configurar Nuevo Sitio"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-5 py-4">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-semibold">Nombre del Sitio</Label>
              <Input
                id="name"
                placeholder="Mi Sitio Corporativo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="domain" className="text-sm font-semibold">Dominio</Label>
              <Input
                id="domain"
                placeholder="misitio.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="url" className="text-sm font-semibold">URL Base (Opcional)</Label>
              <Input
                id="url"
                placeholder="https://misitio.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Color Temático</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 rounded-md border border-gray-300 cursor-pointer p-0 bg-transparent"
                />
                <div className="flex gap-1.5">
                  {PRESET_COLORS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setColor(preset)}
                      className={`w-6 h-6 rounded-full border transition-all ${
                        color.toLowerCase() === preset.toLowerCase()
                          ? "ring-2 ring-black ring-offset-2 scale-110"
                          : "border-gray-300"
                      }`}
                      style={{ backgroundColor: preset }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance" className="font-semibold text-sm">Modo Mantenimiento</Label>
                <p className="text-xs text-gray-500">Bloquea el acceso al panel de administración.</p>
              </div>
              <Switch
                id="maintenance"
                checked={isMaintenance}
                onCheckedChange={setIsMaintenance}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
              <div className="space-y-0.5">
                <Label htmlFor="active" className="font-semibold text-sm">Sitio Activo</Label>
                <p className="text-xs text-gray-500">Habilita o deshabilita este ecosistema por completo.</p>
              </div>
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
            </div>

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-black text-white hover:bg-gray-800" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
                  </>
                ) : (
                  "Guardar Sitio"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
