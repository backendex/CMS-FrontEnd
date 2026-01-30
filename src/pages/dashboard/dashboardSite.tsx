import { SiteSelector } from "@/features/sites/components/sitesSelector";

// Mantenemos los datos aquí por ahora para testear la vista
const WEBSITES = [
  {
    id: 1,
    name: "Extreme Adventure",
    url: "https://extremeadventurecancun.com",
    status: "online" as const,
    toursCount: 12,
    color: "bg-orange-500",
  },
  {
    id: 2,
    name: "What To Do In Cancun",
    url: "https://whattodoincancun.com",
    status: "online" as const,
    toursCount: 25,
    color: "bg-teal-500",
  },
  {
    id: 3,
    name: "Snorkeling Adventure",
    url: "https://snorkeladventuring.com",
    status: "maintenance" as const,
    toursCount: 8,
    color: "bg-blue-500",
  },
  
];

export default function DashboardSite() {
  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Aquí podrías agregar un Navbar global si lo deseas */}
      <SiteSelector sites={WEBSITES} />
    </div>
  );
}