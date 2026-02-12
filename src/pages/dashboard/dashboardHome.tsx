import { SectionCards } from "@/components/ui/section-cards";
import { useSite } from "@/features/sites/components/siteContext";
import rawData from "@/pages/data.json";
import { useEffect } from "react";

export default function DashboardHome() {
  const dashboardItems = rawData;
  const { activeSite } = useSite();
  
  useEffect(() => {
    if (activeSite?.id) {
      fetchDashboardData(activeSite.id);
    }
  }, [activeSite]);
  
  console.log("Datos cargados:", rawData);

  return (
    <>
      {/* 1. Sección de Tarjetas */}
      <section>
        <SectionCards data={dashboardItems} />
      </section>
      {/* 2. Sección de Gráficos */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground text-sm">
          Gráfico de Ventas
        </div>
        <div className="col-span-2 aspect-video rounded-xl bg-muted/50 border border-dashed flex items-center justify-center text-muted-foreground text-sm">
          Actividad Reciente
        </div>
      </div>
      {/* 3. Bloque inferior */}
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/20 border border-dashed md:min-h-min flex items-center justify-center">
        <p className="text-muted-foreground">
          Tabla de Datos / Contenido Adicional
        </p>
      </div>
    </>
  );
}

function fetchDashboardData(id: string) {
  console.log("Cargando datos para el sitio:", id);
}

