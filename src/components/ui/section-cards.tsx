import { IconCircleCheck, IconClock, IconPlayerPlay } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

// Definimos la estructura de los datos del JSON
interface DashboardItem {
  id: number;
  header: string;
  type: string;
  status: string;
  target: string;
  limit: string;
  reviewer: string;
}

interface SectionCardsProps {
  data: DashboardItem[];
}

export function SectionCards({ data }: SectionCardsProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => {
        // Cálculo del porcentaje para la barra de progreso
        const progress = (Number(item.target) / Number(item.limit)) * 100;

        return (
          <Card key={item.id} className="shadow-sm border-zinc-200 dark:border-zinc-800 bg-card">
            <CardHeader className="flex flex-row items-start justify-between pb-2 space-y-0">
              <div className="space-y-1">
                <CardDescription className="text-[10px] uppercase font-bold tracking-tight text-muted-foreground">
                  {item.type}
                </CardDescription>
                <CardTitle className="text-base font-semibold leading-none">
                  {item.header}
                </CardTitle>
              </div>
              
              {/* Badge dinámico según el estado */}
              <Badge 
                variant={item.status === "Done" ? "default" : "secondary"}
                className="ml-2 font-medium"
              >
                {item.status === "Done" && <IconCircleCheck className="size-3 mr-1" />}
                {item.status === "In Progress" && <IconPlayerPlay className="size-3 mr-1" />}
                {item.status === "Not Started" && <IconClock className="size-3 mr-1" />}
                {item.status}
              </Badge>
            </CardHeader>

            <CardContent className="pt-4">
              <div className="flex items-end justify-between mb-2">
                <div className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground italic">Reviewer</span>
                  <span className="text-sm font-medium">{item.reviewer}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold tabular-nums tracking-tight">
                    {item.target}
                  </span>
                  <span className="text-sm text-muted-foreground">/{item.limit}</span>
                </div>
              </div>
              
              {/* Barra de progreso visual */}
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    item.status === "Done" ? "bg-primary" : "bg-primary/60"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  )
}