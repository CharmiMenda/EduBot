import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarTrigger, SidebarHeader, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Calendar, BookOpen, PenTool, MessageSquare, LogOut, ShieldAlert, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

export function AppLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  const navItems = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Calendar", url: "/calendar", icon: Calendar },
    { title: "Materials", url: "/materials", icon: BookOpen },
    { title: "Practice Tests", url: "/tests", icon: PenTool },
    { title: "AI Assistant", url: "/chat", icon: MessageSquare },
  ];

  if (user.role === "admin") {
    navItems.push({ title: "Admin Portal", url: "/admin", icon: ShieldAlert });
  }

  const sidebarStyle = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <Sidebar className="border-r border-border/50">
          <SidebarHeader className="p-6">
            <Link href="/dashboard" className="flex items-center gap-3 font-display font-bold text-xl text-primary hover:opacity-80 transition-opacity">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="hidden md:block">Nexus Placement</span>
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-2 px-4">
                  {navItems.map((item) => {
                    const isActive = location === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild tooltip={item.title} isActive={isActive}>
                          <Link href={item.url} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 mb-4 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-sm font-semibold truncate text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate capitalize">{user.role}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full justify-start gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors rounded-xl" onClick={() => logout()}>
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0 w-full">
          <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-md px-6">
            <SidebarTrigger className="-ml-2 md:hidden" />
            <div className="flex-1" />
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto w-full h-full"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
