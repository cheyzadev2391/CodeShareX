import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { newPasswordSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { EyeIcon, EyeOffIcon, CheckCircle, XCircle } from "lucide-react";
import { z } from "zod";

type ResetPasswordData = z.infer<typeof newPasswordSchema>;

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const { resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(newPasswordSchema),
  });

  useEffect(() => {
    // Get token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
      setValue('token', tokenParam);
    } else {
      // Redirect if no token
      setLocation('/sifremi-unuttum');
    }
  }, [setValue, setLocation]);

  const onSubmit = (data: ResetPasswordData) => {
    resetPassword.mutate(data, {
      onSuccess: () => {
        setIsSuccess(true);
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/50 border-green-800">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-green-400">Şifre Sıfırlandı</CardTitle>
            <CardDescription className="text-gray-400">
              Şifreniz başarıyla sıfırlandı. Artık yeni şifrenizle giriş yapabilirsiniz.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/giris-yap" className="w-full">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                Giriş Yap
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/50 border-green-800">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-red-400">Geçersiz Bağlantı</CardTitle>
            <CardDescription className="text-gray-400">
              Şifre sıfırlama bağlantısı geçersiz veya eksik.
            </CardDescription>
          </CardHeader>

          <CardFooter>
            <Link href="/sifremi-unuttum" className="w-full">
              <Button variant="outline" className="w-full border-green-800 text-green-400 hover:bg-green-950">
                Yeni Bağlantı İste
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black/50 border-green-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-green-400">Yeni Şifre Oluştur</CardTitle>
          <CardDescription className="text-gray-400">
            Hesabınız için yeni bir şifre belirleyin.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {resetPassword.error && (
              <Alert className="border-red-600 bg-red-950/50">
                <AlertDescription className="text-red-400">
                  {(resetPassword.error as any)?.error || "Şifre sıfırlanamadı"}
                </AlertDescription>
              </Alert>
            )}
            
            <input type="hidden" {...register("token")} />
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-green-400">Yeni Şifre</Label>
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

          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={resetPassword.isPending}
              data-testid="button-reset-password"
            >
              {resetPassword.isPending ? "Sıfırlanıyor..." : "Şifreyi Sıfırla"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}