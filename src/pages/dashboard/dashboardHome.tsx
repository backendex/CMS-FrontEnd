import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Clock, 
  Edit3, 
  ArrowRight,
  Sparkles,
  Zap
} from "lucide-react";
import { useSite } from "@/features/sites/components/siteContext";

export default function DashboardHome() {
  const { activeSite } = useSite();
  
  let userName = "Usuario";
  try {
    const userData = JSON.parse(localStorage.getItem("user_data") || "{}");
    userName = userData.name || "Usuario";
  } catch (e) {
    console.error("Error parsing user_data:", e);
  }

  const lastEdited = [
    { title: "Beautiful picture", type: "Article", status: "Draft", time: "32 seconds ago" },
    { title: "A bug is becoming a...", type: "Article", status: "Published", time: "58 seconds ago" },
    { title: "About the strapi blog", type: "Single-Type", status: "Draft", time: "2 minutes ago" },
  ];

  return (
    <div className="p-8 lg:p-12 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Hola, {userName}</h1>
        <p className="text-muted-foreground">Bienvenido a tu panel de administración.</p>
      </div>

      {/* Getting Started Section */}
      <Card className="border-none shadow-sm bg-card overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold">3 pasos para empezar</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-t">
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xs">1</div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Construye la estructura
                  </h3>
                  <p className="text-xs text-muted-foreground">Define tus tipos de contenido y campos.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">2</div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary" />
                    ¿Qué quieres compartir?
                  </h3>
                  <p className="text-xs text-muted-foreground">Empieza a escribir tus primeras entradas.</p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-xs">3</div>
                <div className="space-y-1">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    Mira el contenido en acción
                  </h3>
                  <p className="text-xs text-muted-foreground">Previsualiza cómo se verá en tu sitio.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6 bg-muted/20 border-t flex justify-between items-center">
            <Button size="sm" className="gap-2">
              Probar la API <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Omitir el tour</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Edit3 className="w-4 h-4" />
              Últimas entradas editadas
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {lastEdited.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md group-hover:bg-background transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${item.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {item.status}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-[80px] justify-end">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                  <Edit3 className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-sm font-bold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
              Últimas entradas publicadas
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-1">
            {lastEdited.slice(0, 2).map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-md group-hover:bg-background transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-green-100 text-green-700">
                    Published
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground min-w-[80px] justify-end">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

