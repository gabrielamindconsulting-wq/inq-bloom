import { useState, useMemo } from "react";
import Layout from "@/components/Layout";
import { MOCK_USERS, type SystemUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";

const TYPE_LABELS: Record<string, string> = {
  admin: "Administrador",
  padrao: "Padrão",
  medico: "Médico/Profissional",
  responsavel: "Responsável",
};

const TYPE_BADGE: Record<string, string> = {
  admin: "bg-status-done-bg text-status-done-text",
  padrao: "bg-status-progress-bg text-status-progress-text",
  medico: "bg-status-pending-bg text-status-pending-text",
  responsavel: "bg-muted text-muted-foreground",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      if (search && !u.nome.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
      if (typeFilter !== "todos" && u.tipo !== typeFilter) return false;
      return true;
    });
  }, [search, typeFilter]);

  return (
    <Layout title="Usuários">
      {/* Toolbar */}
      <div className="bg-card rounded-lg border border-border p-4 card-shadow mb-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Todos os tipos" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="padrao">Padrão</SelectItem>
              <SelectItem value="medico">Médico</SelectItem>
              <SelectItem value="responsavel">Responsável</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setDialogOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary-hover">
            <Plus className="h-4 w-4 mr-2" /> Adicionar Usuário
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-lg border border-border card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-foreground">Nome</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Email</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Tipo</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Data Cadastro</th>
                <th className="text-left px-4 py-3 font-semibold text-foreground">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{u.nome}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_BADGE[u.tipo]}`}>
                      {TYPE_LABELS[u.tipo]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.status === "ativo" ? "bg-status-progress-bg text-status-progress-text" : "bg-muted text-muted-foreground"}`}>
                      {u.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-xs border-border">Editar</Button>
                      <Button size="sm" variant="outline" className="text-xs border-destructive text-destructive">Desativar</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Nenhum usuário encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label>Nome Completo *</Label><Input placeholder="Nome completo" /></div>
            <div><Label>Email *</Label><Input type="email" placeholder="email@exemplo.com" /></div>
            <div>
              <Label>Tipo de Acesso *</Label>
              <Select>
                <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="padrao">Padrão</SelectItem>
                  <SelectItem value="medico">Médico/Profissional</SelectItem>
                  <SelectItem value="responsavel">Responsável</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><Label>Telefone</Label><Input placeholder="(XX) XXXXX-XXXX" /></div>
            <div><Label>CRM/Registro (se Médico)</Label><Input placeholder="CRM" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary-hover" onClick={() => setDialogOpen(false)}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
