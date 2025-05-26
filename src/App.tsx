
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Amenities from "./pages/Amenities";
import Board from "./pages/Board";
import Gallery from "./pages/Gallery";
import NewsEvents from "./pages/NewsEvents";
import EventDetail from "./pages/EventDetail";
import Documents from "./pages/Documents";
import AdminDocuments from "./pages/admin/Documents";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Auth from "./pages/auth/Auth";
import PasswordReset from "./pages/auth/PasswordReset";
import Dashboard from "./pages/admin/Dashboard";
import Images from "./pages/admin/Images";
import Content from "./pages/admin/Content";
import AdminEvents from "./pages/admin/Events";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Reservations from "./pages/Reservations";

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
            <Route path="/reservations" element={<Reservations />} />
            <Route path="/board" element={<Board />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/news-events" element={<NewsEvents />} />
            <Route path="/events" element={<Navigate to="/news-events" replace />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/admin/documents" element={<AdminDocuments />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/reset-password" element={<PasswordReset />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/images" element={<Images />} />
            <Route path="/admin/content" element={<Content />} />
            <Route path="/admin/events" element={<AdminEvents />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
