import { ExternalLink, Globe } from "lucide-react";
import { SiteType } from "@/features/sites/types/siteType";

interface Props {
  site: SiteType;
  onManage: () => void;
}

export default function SiteSelector({ site, onManage }: Props) {
  const isDisabled = !site.isActive;
  const isMaintenance = site.isActive && site.isMaintenance;

  const statusLabel = isMaintenance
    ? "Mantenimiento"
    : isDisabled
      ? "Deshabilitado"
      : "Activo";

  const statusClasses = isMaintenance
    ? "bg-yellow-100 text-yellow-700"
    : isDisabled
      ? "bg-gray-200 text-gray-600"
      : "bg-green-100 text-green-700";

  return (
    <div
      className={`w-[300px] rounded-xl border bg-white shadow-sm overflow-hidden
        ${isDisabled ? "opacity-50" : ""}
      `}
    >
      {/* Top color bar */}
      <div className="h-2" style={{ backgroundColor: site.color }} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="w-9 h-9 rounded-md bg-gray-100 flex items-center justify-center">
            <Globe size={18} />
          </div>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${statusClasses}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-lg">{site.name}</h3>
          <p className="text-sm text-gray-500">{site.domain}</p>
        </div>

        {/* Stats */}
        <p className="text-sm text-gray-600">
          ↗ {site.toursCount} Tours / Actividades
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onManage}
            disabled={isDisabled}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition
              ${
                isDisabled
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }
            `}
                    >
            Gestionar →
          </button>
          <a
            href={`https://${site.domain}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
