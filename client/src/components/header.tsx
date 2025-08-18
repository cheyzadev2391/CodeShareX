import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut, Settings } from "lucide-react";

export function Header() {
  const [location] = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Ana Sayfa" },
    { href: "/galeri", label: "Galeri" },
    { href: "/paylas", label: "Paylaş" },
    { href: "/arama", label: "Ara" },
  ];

  const handleLogout = () => {
    logout.mutate();
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-black/50 border-b border-green-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">
              MinuslarDev
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-gray-300 hover:text-green-400 hover:bg-green-950/50 ${
                    location === item.href ? "text-green-400 bg-green-950/30" : ""
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-green-400 hover:text-green-300 hover:bg-green-950/50"
                    data-testid="button-user-menu"
                  >
                    <User className="w-4 h-4 mr-2" />
                    {user?.firstName || user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="bg-black border-green-800 text-white"
                  align="end"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/hesabim" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      <span data-testid="menu-profile">Hesabım</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-green-800" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-red-400 focus:text-red-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span data-testid="menu-logout">Çıkış Yap</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Link href="/giris-yap">
                  <Button
                    variant="outline"
                    className="border-green-800 text-green-400 hover:bg-green-950"
                    data-testid="button-login"
                  >
                    Giriş Yap
                  </Button>
                </Link>
                <Link href="/kayit-ol">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    data-testid="button-register"
                  >
                    Kayıt Ol
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-green-400 hover:text-green-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-green-800">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-gray-300 hover:text-green-400 hover:bg-green-950/50 ${
                      location === item.href ? "text-green-400 bg-green-950/30" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
              
              <div className="pt-4 border-t border-green-800 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link href="/hesabim">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-green-400 hover:text-green-300 hover:bg-green-950/50"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-profile"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Hesabım
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/50"
                      onClick={handleLogout}
                      data-testid="mobile-logout"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Çıkış Yap
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/giris-yap">
                      <Button
                        variant="outline"
                        className="w-full border-green-800 text-green-400 hover:bg-green-950"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-login"
                      >
                        Giriş Yap
                      </Button>
                    </Link>
                    <Link href="/kayit-ol">
                      <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="mobile-register"
                      >
                        Kayıt Ol
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}