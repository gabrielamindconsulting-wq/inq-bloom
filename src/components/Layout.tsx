import { NavLink } from "@/components/NavLink";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo-inq.png";
import { CONTADORES, TOTAL_PENDENCIAS } from "@/data/notificationsData";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar,
} from "@/components/ui/sidebar";
import {
  BarChart3, QrCode, Users, LogOut, Menu, LayoutDashboard, CalendarDays, RefreshCw,
  UserRound, Stethoscope, CheckSquare, DoorOpen, FileCheck, ShieldCheck, Receipt, AlertOctagon,
  Wallet, Banknote, PieChart, ClipboardList, Target, Sparkles, FileSignature, Building2,
  UsersRound, Briefcase, Bot, Network, LineChart, Building, ScrollText, Percent, TrendingUp,
  Bell, HandCoins, CircleDollarSign, FileWarning, Landmark, Coins,
} from "lucide-react";


const navSections = [
  {
    label: "RASTREIO",
    items: [
      { title: "Rastreio – Triagem", url: "/", icon: BarChart3 },
      { title: "QR Code", url: "/qrcode", icon: QrCode, indent: true },
    ],
  },
  {
    label: "CLÍNICA",
    items: [
      { title: "Dashboard Clínico", url: "/clinico", icon: LayoutDashboard },
      { title: "Agenda", url: "/agenda", icon: CalendarDays },
      { title: "Substituições", url: "/substituicoes", icon: RefreshCw },
      { title: "Pacientes", url: "/pacientes", icon: UserRound },
      { title: "Profissionais", url: "/profissionais", icon: Stethoscope },
      { title: "Check-in", url: "/checkin", icon: CheckSquare },
      { title: "Salas", url: "/salas", icon: DoorOpen },
    ],
  },
  {
    label: "FATURAMENTO",
    items: [
      { title: "Convênios & Valores", url: "/convenios", icon: ShieldCheck },
      { title: "Guias & Autorizações", url: "/guias", icon: FileCheck, badge: CONTADORES.Guias },
      { title: "Faturamento", url: "/faturamento", icon: Receipt, badge: CONTADORES.Faturamento },
      { title: "Glosas & Contestações", url: "/glosas", icon: AlertOctagon, badge: CONTADORES.Glosas },
      { title: "Repasse Profissional", url: "/repasses", icon: Wallet, badge: CONTADORES.Repasse },
    ],
  },
  {
    label: "FINANCEIRO",
    items: [
      { title: "Contas a Receber", url: "/contas-receber", icon: CircleDollarSign },
      { title: "Inadimplência", url: "/inadimplencia", icon: FileWarning, badge: CONTADORES.Financeiro },
      { title: "Glosa a Receber", url: "/glosa-receber", icon: HandCoins },
      { title: "Contas a Pagar", url: "/contas-pagar", icon: Coins },
      { title: "Fluxo de Caixa", url: "/fluxo-caixa", icon: Banknote },
      { title: "Conciliação Bancária", url: "/conciliacao", icon: Landmark },
      { title: "Caixa da Recepção", url: "/caixa-recepcao", icon: Building },
      { title: "Margem de Contribuição", url: "/margem", icon: Percent },
      { title: "DRE por Competência", url: "/dre", icon: PieChart },
    ],
  },

  {
    label: "CLÍNICO+",
    items: [
      { title: "Protocolos & Avaliações", url: "/protocolos", icon: ClipboardList },
      { title: "PTS", url: "/pts", icon: Target },
      { title: "Relatórios Automáticos", url: "/relatorios", icon: FileSignature },
    ],
  },
  {
    label: "OPERAÇÕES",
    items: [
      { title: "Ocupação de Salas", url: "/ocupacao", icon: Building2 },
      { title: "Metas de Agenda", url: "/metas-agenda", icon: TrendingUp },
      { title: "Grade p/ Convênio", url: "/grade-convenio", icon: ScrollText },
    ],
  },
  {
    label: "INSTITUCIONAL",
    items: [
      { title: "RH", url: "/rh", icon: Briefcase },
      { title: "CRM Comercial", url: "/crm", icon: LineChart },
      { title: "IA Institucional", url: "/ia", icon: Bot },
      { title: "Governança", url: "/governanca", icon: Network },
    ],
  },
  {
    label: "SISTEMA",
    items: [
      { title: "Notificações", url: "/notificacoes", icon: Bell, badge: TOTAL_PENDENCIAS },
      { title: "Usuários & Permissões", url: "/usuarios", icon: Users },
    ],
  },
];


function AppSidebarContent() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <div className="p-4 flex items-center gap-2 border-b border-border">
        {!collapsed
          ? <img src={logo} alt="Instituto Nadja Quadros" className="h-10 object-contain" />
          : <img src={logo} alt="INQ" className="h-8 w-8 object-contain" />}
      </div>
      <SidebarContent className="pt-2">
        {navSections.map(section => (
          <SidebarGroup key={section.label}>
            {!collapsed && (
              <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-3 py-1">
                {section.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map(item => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
                            (item as any).indent && !collapsed ? "ml-4" : ""
                          } ${
                            isActive
                              ? "bg-gradient-to-r from-primary-light to-transparent text-primary font-semibold border-l-[3px] border-primary"
                              : "text-muted-foreground hover:bg-primary-light/60 hover:text-foreground"
                          }`}
                          activeClassName=""
                        >
                          <div className="relative shrink-0">
                            <item.icon className="h-4 w-4" />
                            {collapsed && !!(item as any).badge && (
                              <span className="absolute -top-1.5 -right-1.5 h-2 w-2 rounded-full bg-red-600" />
                            )}
                          </div>
                          {!collapsed && <span className="truncate">{item.title}</span>}
                          {!collapsed && !!(item as any).badge && (
                            <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-semibold text-white">
                              {(item as any).badge}
                            </span>
                          )}
                        </NavLink>

                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {!collapsed && (
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">NQ</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Dra. Nadja Quadros</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground"><LogOut className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </Sidebar>
  );
}

interface LayoutProps { children: React.ReactNode; title: string; }

export default function Layout({ children, title }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[60px] flex items-center justify-between border-b border-border bg-background px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger><Menu className="h-5 w-5" /></SidebarTrigger>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Dra. Nadja Quadros</span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">NQ</div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-[#eef1ef] p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
