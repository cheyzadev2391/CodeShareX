import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const onSubmit = (data: LoginData) => {
    login.mutate(data, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/50 border-green-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-400">Giriş Yap</CardTitle>
          <CardDescription className="text-gray-400">
            MinuslarDev hesabınıza giriş yapın
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {login.error && (
              <Alert className="border-red-600 bg-red-950/50">
                <AlertDescription className="text-red-400">
                  {(login.error as any)?.error || "Giriş yapılamadı"}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-400">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                className="bg-gray-900 border-green-800 text-white placeholder:text-gray-500"
                data-testid="input-email"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-400">Şifre</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-gray-900 border-green-800 text-white placeholder:text-gray-500 pr-10"
                  data-testid="input-password"
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <div className="text-right">
              <Link href="/sifremi-unuttum">
                <Button 
                  variant="link" 
                  className="text-green-400 hover:text-green-300 p-0 h-auto"
                  data-testid="link-forgot-password"
                >
                  Şifremi unuttum
                </Button>
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={login.isPending}
              data-testid="button-login"
            >
              {login.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Hesabınız yok mu?{" "}
              <Link href="/kayit-ol">
                <Button 
                  variant="link" 
                  className="text-green-400 hover:text-green-300 p-0 h-auto"
                  data-testid="link-register"
                >
                  Kayıt ol
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}