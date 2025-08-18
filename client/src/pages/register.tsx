import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { registerSchema, type RegisterData } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();
  const { register: registerUser, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    setLocation("/");
    return null;
  }

  const onSubmit = (data: RegisterData) => {
    registerUser.mutate(data, {
      onSuccess: () => {
        setLocation("/");
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/50 border-green-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-400">Kayıt Ol</CardTitle>
          <CardDescription className="text-gray-400">
            MinuslarDev hesabı oluşturun
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {registerUser.error && (
              <Alert className="border-red-600 bg-red-950/50">
                <AlertDescription className="text-red-400">
                  {(registerUser.error as any)?.error || "Kayıt olunamadı"}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-green-400">Ad</Label>
                <Input
                  id="firstName"
                  placeholder="Adınız"
                  className="bg-gray-900 border-green-800 text-white placeholder:text-gray-500"
                  data-testid="input-firstName"
                  {...register("firstName")}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-400">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-green-400">Soyad</Label>
                <Input
                  id="lastName"
                  placeholder="Soyadınız"
                  className="bg-gray-900 border-green-800 text-white placeholder:text-gray-500"
                  data-testid="input-lastName"
                  {...register("lastName")}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-400">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-green-400">Kullanıcı Adı</Label>
              <Input
                id="username"
                placeholder="kullaniciadi"
                className="bg-gray-900 border-green-800 text-white placeholder:text-gray-500"
                data-testid="input-username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-red-400">{errors.username.message}</p>
              )}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-green-400">Şifre Tekrar</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="bg-gray-900 border-green-800 text-white placeholder:text-gray-500 pr-10"
                  data-testid="input-confirmPassword"
                  {...register("confirmPassword")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  data-testid="button-toggle-confirmPassword"
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={registerUser.isPending}
              data-testid="button-register"
            >
              {registerUser.isPending ? "Kayıt olunuyor..." : "Kayıt Ol"}
            </Button>
            
            <div className="text-center text-sm text-gray-400">
              Zaten hesabınız var mı?{" "}
              <Link href="/giris-yap">
                <Button 
                  variant="link" 
                  className="text-green-400 hover:text-green-300 p-0 h-auto"
                  data-testid="link-login"
                >
                  Giriş yap
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}