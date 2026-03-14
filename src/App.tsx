import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { RepoLayout } from "@/components/layout/RepoLayout";

// Landing + Auth
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";

// App pages
import DashboardPage from "@/pages/app/Dashboard";
import RepoOverview from "@/pages/app/repo/Overview";
import ArchitecturePage from "@/pages/app/repo/Architecture";
import DependenciesPage from "@/pages/app/repo/Dependencies";
import OnboardingPage from "@/pages/app/repo/Onboarding";
import HealthPage from "@/pages/app/repo/Health";
import DeadCodePage from "@/pages/app/repo/DeadCode";
import ChangelogsPage from "@/pages/app/repo/Changelogs";
import RepoSettingsPage from "@/pages/app/repo/Settings";
import AccountSettingsPage from "@/pages/app/settings/AccountSettings";
import AccountGeneralPage from "@/pages/app/settings/AccountGeneral";
import IntegrationsPage from "@/pages/app/settings/IntegrationsPage";

// ConnectModal page
import ConnectPage from "@/pages/AppConnect";

import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />

            {/* App layout (topbar only) */}
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="connect" element={<ConnectPage />} />
              <Route path="settings" element={<AccountSettingsPage />}>
                <Route index element={<AccountGeneralPage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
              </Route>
            </Route>

            {/* Repo layout (topbar + sidebar) */}
            <Route path="/app/repo/:repoId" element={<RepoLayout />}>
              <Route index element={<RepoOverview />} />
              <Route path="architecture" element={<ArchitecturePage />} />
              <Route path="dependencies" element={<DependenciesPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="health" element={<HealthPage />} />
              <Route path="dead-code" element={<DeadCodePage />} />
              <Route path="changelogs" element={<ChangelogsPage />} />
              <Route path="settings" element={<RepoSettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
