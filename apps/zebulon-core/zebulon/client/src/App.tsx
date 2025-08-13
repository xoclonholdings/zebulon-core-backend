import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import Dashboard from "@/pages/dashboard";
import NotFound from "@/pages/not-found";
import AppPage from "@/components/AppPage";


function AppRoutes() {
  return (
    <Router>
      <div className="mobile-viewport mobile-container bg-black overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/app/:id" element={<AppPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}





function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <>
        <Toaster />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </>
    </QueryClientProvider>
  );
}

export default App;

