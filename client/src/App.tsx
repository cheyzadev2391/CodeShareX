import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Share from "@/pages/share";
import Gallery from "@/pages/gallery";
import Search from "@/pages/search";
import NotFound from "@/pages/not-found";

function App() {
  const [currentSection, setCurrentSection] = useState('home');

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-dark-green via-gray-900 to-black text-white font-inter">
          <Header currentSection={currentSection} onSectionChange={setCurrentSection} />
          
          <main className="container mx-auto px-6 py-8">
            {currentSection === 'home' && <Home onNavigate={setCurrentSection} />}
            {currentSection === 'share' && <Share />}
            {currentSection === 'gallery' && <Gallery />}
            {currentSection === 'search' && <Search />}
          </main>

          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
