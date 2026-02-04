import { ExternalLink, Globe } from "lucide-react";
import { SiteType } from "@/features/sites/types/siteType";

interface Props {
  site: SiteType;
  onManage: (id: number) => void;
}

export default function SiteSelector({ site, onManage }: Props) {
  const isActive = site.status === "active";

  return (
    <div className="w-[300px] rounded-xl border bg-white shadow-sm overflow-hidden">
      {/* Top color bar */}
      <div
        className="h-2"
        style={{ backgroundColor: site.color }}
      />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
            <Globe size={18} />
          </div>

          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {isActive ? "Activo" : "Mantenimiento"}
          </span>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-lg">{site.name}</h3>
          <p className="text-sm text-gray-500">{site.url}</p>
        </div>

        {/* Stats */}
        <p className="text-sm text-gray-600">
          ↗ {site.toursCount} Tours / Actividades
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onManage(site.id)}
            className="flex-1 bg-black text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-900 transition"
          >
            Gestionar →
          </button>

          <a
            href={site.url}
            target="_blank"
            className="p-2 rounded-lg border hover:bg-gray-100"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
