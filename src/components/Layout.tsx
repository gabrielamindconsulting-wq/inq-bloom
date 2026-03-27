import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import logo from "@/assets/logo-inq.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { BarChart3, QrCode, Users, LogOut, Menu } from "lucide-react";

const navItems = [
  { title: "Rastreio – Triagem", url: "/", icon: BarChart3 },
  { title: "QR Code", url: "/qrcode", icon: QrCode, indent: true },
  { title: "Usuários", url: "/usuarios", icon: Users },
];

function AppSidebarContent() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <div className="p-4 flex items-center gap-2 border-b border-border">
        {!collapsed && <img src={logo} alt="Instituto Nadja Quadros" className="h-10 object-contain" />}
        {collapsed && <img src={logo} alt="INQ" className="h-8 w-8 object-contain" />}
      </div>
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                          item.indent && !collapsed ? "ml-4" : ""
                        } ${isActive ? "bg-muted text-accent-foreground font-semibold border-l-[3px] border-primary" : "text-muted-foreground hover:bg-primary-light"}`}
                        activeClassName=""
                      >
                        <item.icon className="h-5 w-5 shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {!collapsed && (
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm">
              NQ
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Dra. Nadja Quadros</p>
              <p className="text-xs text-muted-foreground">Administrador</p>
            </div>
            <button className="text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </Sidebar>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebarContent />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-[60px] flex items-center justify-between border-b border-border bg-background px-4 shrink-0">
            <div className="flex items-center gap-3">
              <SidebarTrigger>
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <h1 className="text-lg font-bold text-foreground">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Dra. Nadja Quadros</span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-semibold">
                NQ
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto bg-[hsl(0_0%_97%)] p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
