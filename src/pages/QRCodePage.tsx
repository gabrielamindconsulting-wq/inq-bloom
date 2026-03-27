import { useState } from "react";
import Layout from "@/components/Layout";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Printer, Check } from "lucide-react";
import logo from "@/assets/logo-inq.png";
import { useToast } from "@/hooks/use-toast";

export default function QRCodePage() {
  const [formUrl, setFormUrl] = useState("https://inqsaude.com.br/rastreio");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(formUrl);
    setCopied(true);
    toast({ title: "Link copiado!", description: "O link foi copiado para a área de transferência." });
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout title="QR Code para Rastreio">
      <div className="max-w-lg mx-auto">
        <div className="bg-card rounded-lg border border-border p-8 card-shadow text-center">
          <img src={logo} alt="Instituto Nadja Quadros" className="h-14 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-1">Rastreio de Desenvolvimento Neuropsicomotor</h2>
          <p className="text-sm text-muted-foreground mb-8">Instituto Nadja Quadros</p>

          <div className="bg-background border border-border rounded-xl p-6 inline-block mb-6">
            <QRCodeSVG value={formUrl} size={220} level="H" fgColor="#2D6A2D" />
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-foreground mb-2 block text-left">Link do formulário:</label>
            <div className="flex gap-2">
              <Input value={formUrl} onChange={(e) => setFormUrl(e.target.value)} />
              <Button variant="outline" onClick={handleCopy} className="shrink-0 border-primary text-primary">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground mb-6">
            Use este QR Code para compartilhar o formulário de rastreio com os responsáveis.
            O formulário é gratuito e pode ser preenchido pelo celular.
          </p>

          <Button onClick={handlePrint} className="bg-primary text-primary-foreground hover:bg-primary-hover w-full">
            <Printer className="h-4 w-4 mr-2" /> Imprimir / Baixar QR Code
          </Button>
        </div>
      </div>
    </Layout>
  );
}
