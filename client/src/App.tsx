import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";

// Pages
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import Calendar from "@/pages/Calendar";
import Materials from "@/pages/Materials";
import PracticeTests from "@/pages/PracticeTests";
import Chatbot from "@/pages/Chatbot";

function ProtectedRoute({ component: Component, adminOnly = false }: { component: any, adminOnly?: boolean }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <Component />;
}

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/login" component={Login} />
        
        {/* Protected Routes */}
        <Route path="/dashboard"><ProtectedRoute component={Dashboard} /></Route>
        <Route path="/calendar"><ProtectedRoute component={Calendar} /></Route>
        <Route path="/materials"><ProtectedRoute component={Materials} /></Route>
        <Route path="/tests"><ProtectedRoute component={PracticeTests} /></Route>
        <Route path="/chat"><ProtectedRoute component={Chatbot} /></Route>
        
        {/* Admin Route */}
        <Route path="/admin"><ProtectedRoute component={AdminDashboard} adminOnly /></Route>

        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
