import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Share from "@/pages/share";
import Gallery from "@/pages/gallery";
import Search from "@/pages/search";
import Login from "@/pages/login";
import Register from "@/pages/register";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 text-white font-inter">
          <Header />
          
          <main>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/paylas" component={Share} />
              <Route path="/galeri" component={Gallery} />
              <Route path="/arama" component={Search} />
              <Route path="/giris-yap" component={Login} />
              <Route path="/kayit-ol" component={Register} />
              <Route path="/sifremi-unuttum" component={ForgotPassword} />
              <Route path="/sifre-sifirla" component={ResetPassword} />
              <Route path="/hesabim" component={Profile} />
              <Route component={NotFound} />
            </Switch>
          </main>

          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
