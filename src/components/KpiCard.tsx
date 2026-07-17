import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: LucideIcon;
  accent?: boolean;
  trend?: { value: string; positive?: boolean };
}

export function KpiCard({ label, value, hint, icon: Icon, accent, trend }: KpiCardProps) {
  return (
    <Card className={cn("card-shadow relative overflow-hidden", accent && "border-l-4 border-l-primary")}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{label}</p>
            <p className="kpi-number text-3xl mt-2 text-foreground">{value}</p>
            {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
            {trend && <p className={cn("text-xs mt-1.5 font-medium", trend.positive ? "text-emerald-600" : "text-red-600")}>{trend.value}</p>}
          </div>
          {Icon && (
            <div className="h-9 w-9 rounded-lg bg-primary-light text-primary flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ExportButtons({ onCsv, onPdf, onXlsx }: { onCsv?: () => void; onPdf?: () => void; onXlsx?: () => void }) {
  return null;
}
