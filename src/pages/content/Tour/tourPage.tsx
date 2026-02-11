import { ToursTable } from "@/features/tours/components/tourTable";

export default function ToursPage() {
  const manualId = "f012001e-9cd4-4cc5-b849-a44a701e5869";

  return (
    <div className="container mx-auto p-6 text-black">
      <h1 className="text-2xl font-bold mb-4">Gestión de Tours</h1>
      <ToursTable siteId={manualId} />
    </div>
  );
}

