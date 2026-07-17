import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MOCK_ROOMS, ESPECIALIDADE_COLORS, type Room, type RoomUnit, type RoomCategory } from "@/data/clinicalMockData";
import { Plus, Pencil, Trash2, Search, DoorOpen, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const UNITS: RoomUnit[] = ["Asa Sul", "Águas Claras"];
const CATEGORIES: RoomCategory[] = ["Fonoaudiologia", "Terapia Ocupacional", "Fisioterapia", "Psicologia", "Psicopedagogia", "Neuropsicologia"];

export default function RoomsPage() {
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
  const [search, setSearch] = useState("");
  const [filterUnit, setFilterUnit] = useState("all");
  const [filterCat, setFilterCat] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [deleteRoom, setDeleteRoom] = useState<Room | null>(null);

  const [formNome, setFormNome] = useState("");
  const [formNumero, setFormNumero] = useState("");
  const [formUnidade, setFormUnidade] = useState<RoomUnit>("Asa Sul");
  const [formCategoria, setFormCategoria] = useState<RoomCategory>("Fonoaudiologia");
  const [formCapacidade, setFormCapacidade] = useState<number>(1);

  const filtered = rooms.filter(r => {
    if (search && !r.nome.toLowerCase().includes(search.toLowerCase()) && !r.numero.includes(search)) return false;
    if (filterUnit !== "all" && r.unidade !== filterUnit) return false;
    if (filterCat !== "all" && r.categoria !== filterCat) return false;
    return true;
  });

  function openCreate() {
    setEditingRoom(null);
    setFormNome(""); setFormNumero(""); setFormUnidade("Asa Sul"); setFormCategoria("Fonoaudiologia"); setFormCapacidade(1);
    setModalOpen(true);
  }
  function openEdit(room: Room) {
    setEditingRoom(room);
    setFormNome(room.nome); setFormNumero(room.numero); setFormUnidade(room.unidade); setFormCategoria(room.categoria); setFormCapacidade(room.capacidade);
    setModalOpen(true);
  }
  function handleSave() {
    if (!formNome.trim() || !formNumero.trim() || formCapacidade < 1) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }
    if (editingRoom) {
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? { ...r, nome: formNome, numero: formNumero, unidade: formUnidade, categoria: formCategoria, capacidade: formCapacidade } : r));
      toast({ title: "Sala atualizada com sucesso" });
    } else {
      setRooms(prev => [...prev, { id: `room-${Date.now()}`, nome: formNome, numero: formNumero, unidade: formUnidade, categoria: formCategoria, capacidade: formCapacidade }]);
      toast({ title: "Sala cadastrada com sucesso" });
    }
    setModalOpen(false);
  }
  function handleDelete() {
    if (!deleteRoom) return;
    setRooms(prev => prev.filter(r => r.id !== deleteRoom.id));
    toast({ title: "Sala excluída com sucesso" });
    setDeleteRoom(null);
  }

  return (
    <Layout title="Salas">
      <div className="space-y-4">
        <Card className="card-shadow bg-primary-light border-primary/20">
          <CardContent className="p-4 flex gap-3 items-start">
            <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="text-sm text-foreground">
              A <strong>capacidade</strong> define quantos profissionais atendem simultaneamente na mesma sala.
              Esse número gera os quadros de vaga na <strong>Agenda</strong> (sala × horário).
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou número..." className="pl-9 w-[240px]" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <Select value={filterUnit} onValueChange={setFilterUnit}>
            <SelectTrigger className="w-[170px]"><SelectValue placeholder="Unidade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas unidades</SelectItem>
              {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterCat} onValueChange={setFilterCat}>
            <SelectTrigger className="w-[200px]"><SelectValue placeholder="Categoria" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="ml-auto">
            <Button className="gap-2" onClick={openCreate}><Plus className="h-4 w-4" /> Nova Sala</Button>
          </div>
        </div>

        <Card className="card-shadow">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/5">
                  <TableHead>Nome</TableHead>
                  <TableHead>Número</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Capacidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <DoorOpen className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Nenhuma sala encontrada</p>
                    </TableCell>
                  </TableRow>
                ) : filtered.map(room => (
                  <TableRow key={room.id} className="hover:bg-muted/40">
                    <TableCell className="font-medium">{room.nome}</TableCell>
                    <TableCell>{room.numero}</TableCell>
                    <TableCell>{room.unidade}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ESPECIALIDADE_COLORS[room.categoria]}`}>{room.categoria}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center justify-center min-w-8 h-6 px-2 rounded-md bg-primary-light text-primary font-semibold text-sm">
                        {room.capacidade}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="outline" size="sm" onClick={() => openEdit(room)}><Pencil className="h-3.5 w-3.5" /></Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => setDeleteRoom(room)}><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Editar Sala" : "Nova Sala"}</DialogTitle>
            <DialogDescription>{editingRoom ? "Atualize os dados da sala." : "Preencha os dados para cadastrar uma nova sala."}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Nome *</Label><Input value={formNome} onChange={e => setFormNome(e.target.value)} placeholder="Ex: Sala Fono 1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2"><Label>Número *</Label><Input value={formNumero} onChange={e => setFormNumero(e.target.value)} placeholder="Ex: 101" /></div>
              <div className="space-y-2">
                <Label>Capacidade *</Label>
                <Input type="number" min={1} max={10} value={formCapacidade} onChange={e => setFormCapacidade(Number(e.target.value))} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-2">Profissionais que atendem simultaneamente. Define os quadros de vaga na Agenda.</p>
            <div className="space-y-2">
              <Label>Unidade</Label>
              <Select value={formUnidade} onValueChange={v => setFormUnidade(v as RoomUnit)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={formCategoria} onValueChange={v => setFormCategoria(v as RoomCategory)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editingRoom ? "Salvar" : "Cadastrar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteRoom} onOpenChange={() => setDeleteRoom(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Excluir Sala</DialogTitle>
            <DialogDescription>Tem certeza que deseja excluir a sala "{deleteRoom?.nome}"? Esta ação não pode ser desfeita.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRoom(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
