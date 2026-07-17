import { Button } from "@/components/ui/button";
import { FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ExportBar({ label = "Exportar" }: { label?: string }) {
  const { toast } = useToast();
  const notify = (fmt: string) => toast({ title: `${label} em ${fmt}`, description: "Arquivo gerado (mock)." });
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notify("PDF")}>
        <FileText className="h-4 w-4" /> PDF
      </Button>
      <Button variant="outline" size="sm" className="gap-1.5" onClick={() => notify("Excel")}>
        <FileSpreadsheet className="h-4 w-4" /> Excel
      </Button>
    </div>
  );
}
