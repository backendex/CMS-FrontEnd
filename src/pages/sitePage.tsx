/* eslint-disable @typescript-eslint/no-unused-vars */
import  SiteSelector  from "@/features/sites/components/siteSelector";
import { SiteType } from "@/features/sites/types/siteType";
import { useEffect, useState } from "react";
import { getMe } from "@/features/auth/api/auth.api";
import { useNavigate } from "react-router-dom";

export default function SitePage() {
  const [sites, setSites] = useState<SiteType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getMe()
      .then((res) => {
        setSites(res.allowedSites);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleManage = (site: SiteType) => {
    if (!site.isActive) {
      alert("Este sitio está en mantenimiento");
      return;
    }
    
    localStorage.setItem("activeSite", JSON.stringify(site));

    navigate(`/dash/${site.id}`);
  };

  if (loading) {
    return <p className="p-10">Cargando sitios...</p>;
  }

  if (sites.length === 0) {
    return (
      <div className="p-10">
        <h2 className="text-xl font-semibold">Acceso restringido</h2>
        <p>No tienes sitios asignados.</p>
      </div>
    );
  } 
   
  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <h1 className="text-3xl font-bold mb-2">CMS</h1>
      <p className="text-gray-600 mb-8">
        Selecciona un ecosistema para administrar.
      </p>

      <div className="flex gap-6 flex-wrap">
        {sites.map((site) => (
          <SiteSelector
            key={site.id}
            site={{
              ...site,
              color: site.color ?? "#3b82f6",
            }}
            onManage={() => handleManage(site)}
          />
        ))}
      </div>
    </div>
  );
}

