import { CheckCircle2, XCircle,ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const SeoAnalysis = () => {
  return (
    <Card className="shadow-sm border-t-4 border-t-green-500">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <div className="flex items-center gap-2">
          <div className="bg-green-100 p-1 rounded-full">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <CardTitle className="text-sm font-medium">SEO Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">Coral Reefs of the Riviera Maya</p>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sección de Problemas */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            Problems <Badge variant="secondary" className="bg-slate-100 text-slate-600">3</Badge>
          </h4>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm italic">
              <div className="h-2 w-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
              <span>Keyphrase distribution: Have you evenly distributed your focus keyphrase?</span>
            </li>
            <li className="flex gap-3 text-sm">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <span>Internal links: No internal links appear in this page.</span>
            </li>
          </ul>
        </div>

        {/* Sección de Buenos Resultados */}
        <div>
          <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
            Good results <Badge variant="secondary" className="bg-slate-100 text-slate-600">13</Badge>
          </h4>
          <ul className="space-y-3">
            <li className="flex gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>Image Keyphrase: Good job!</span>
            </li>
            <li className="flex gap-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span>Text length: The text contains 613 words. Good job!</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};