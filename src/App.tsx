
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Amenities from "./pages/Amenities";
import Board from "./pages/Board";
import Gallery from "./pages/Gallery";
import Events from "./pages/Events";
import Documents from "./pages/Documents";
import AdminDocuments from "./pages/admin/Documents";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Auth from "./pages/auth/Auth";
import Dashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/amenities" element={<Amenities />} />
            <Route path="/board" element={<Board />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/events" element={<Events />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
