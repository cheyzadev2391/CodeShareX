import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { resetPasswordSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { z } from "zod";

type ForgotPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordData) => {
    forgotPassword.mutate(data.email, {
      onSuccess: (response) => {
        setIsSuccess(true);
        // Demo: show token for testing
        if ((response as any).resetToken) {
          setResetToken((response as any).resetToken);
        }
      },
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-black/50 border-green-800">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold text-green-400">E-posta Gönderildi</CardTitle>
            <CardDescription className="text-gray-400">
              Şifre sıfırlama bağlantısı {getValues("email")} adresine gönderildi.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-400">
              E-postanızı kontrol edin ve bağlantıya tıklayarak şifrenizi sıfırlayın.
            </p>
            
            {resetToken && (
              <Alert className="border-green-600 bg-green-950/50">
                <AlertDescription className="text-green-400 text-xs">
                  <strong>Demo Token:</strong> {resetToken}
                  <br />
                  <Link href={`/sifre-sifirla?token=${resetToken}`}>
                    <Button variant="link" className="text-green-300 p-0 h-auto text-xs">
                      Test için buraya tıklayın
                    </Button>
                  </Link>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter>
            <Link href="/giris-yap" className="w-full">
              <Button variant="outline" className="w-full border-green-800 text-green-400 hover:bg-green-950">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Giriş sayfasına dön
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
          <CardTitle className="text-2xl font-bold text-green-400">Şifremi Unuttum</CardTitle>
          <CardDescription className="text-gray-400">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı göndereceğiz.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {forgotPassword.error && (
              <Alert className="border-red-600 bg-red-950/50">
                <AlertDescription className="text-red-400">
                  {(forgotPassword.error as any)?.error || "Bir hata oluştu"}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-400">E-posta Adresi</Label>
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
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={forgotPassword.isPending}
              data-testid="button-send-reset"
            >
              {forgotPassword.isPending ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
            </Button>
            
            <Link href="/giris-yap" className="w-full">
              <Button variant="outline" className="w-full border-green-800 text-green-400 hover:bg-green-950">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Giriş sayfasına dön
              </Button>
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}