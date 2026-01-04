import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Resultados from "./pages/Resultados"; // Página de Busca (agora /corridas)
import RaceDetails from "./pages/RaceDetails";
import Cadastrar from "./pages/Cadastrar";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import EventosPassados from "./pages/EventosPassados"; // Página de Passadas (agora /resultados)
import TorreDeControle from "./pages/TorreDeControle"; // Novo Import para o Admin

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              {/* MUDANÇA: /resultados vira /corridas */}
              <Route path="/corridas" element={<Resultados />} />
              {/* MUDANÇA: /historico vira /resultados */}
              <Route path="/resultados" element={<EventosPassados />} />
              
              <Route path="/corrida/:id" element={<RaceDetails />} />
              <Route path="/cadastrar" element={<Cadastrar />} />
              <Route path="/contato" element={<Contato />} />

              {/* Rota da Torre de Controle (Admin Oculto) */}
              <Route path="/torredecontrole" element={<TorreDeControle />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;