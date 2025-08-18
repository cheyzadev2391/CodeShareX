import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth, useProfile } from "@/hooks/useAuth";
import { updateProfileSchema, changeEmailSchema, changePasswordSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, Lock, Code, EyeIcon, EyeOffIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { CodeSnippet } from "@shared/schema";
import { z } from "zod";

type UpdateProfileData = z.infer<typeof updateProfileSchema>;
type ChangeEmailData = z.infer<typeof changeEmailSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function Profile() {
  const { user, logout } = useAuth();
  const { updateProfile, changeEmail, changePassword } = useProfile();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailPassword, setShowEmailPassword] = useState(false);

  // Get user's code snippets
  const { data: userCodes, isLoading: codesLoading } = useQuery({
    queryKey: ["profile", "codes"],
    queryFn: async (): Promise<CodeSnippet[]> => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/profile/codes", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user codes");
      }

      return await response.json();
    },
    enabled: !!user,
  });

  // Profile form
  const profileForm = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
    },
  });

  // Email form
  const emailForm = useForm<ChangeEmailData>({
    resolver: zodResolver(changeEmailSchema),
  });

  // Password form
  const passwordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleUpdateProfile = (data: UpdateProfileData) => {
    updateProfile.mutate(data, {
      onSuccess: () => {
        profileForm.reset({
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
        });
      },
    });
  };

  const handleChangeEmail = (data: ChangeEmailData) => {
    changeEmail.mutate(data, {
      onSuccess: () => {
        emailForm.reset();
      },
    });
  };

  const handleChangePassword = (data: ChangePasswordData) => {
    changePassword.mutate(data, {
      onSuccess: () => {
        passwordForm.reset();
      },
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-950 via-black to-green-950 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-400 mb-2">Hesabım</h1>
          <p className="text-gray-400">Profil bilgilerinizi yönetin</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/50 border border-green-800">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              data-testid="tab-profile"
            >
              <User className="w-4 h-4 mr-2" />
              Profil
            </TabsTrigger>
            <TabsTrigger 
              value="email" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              data-testid="tab-email"
            >
              <Mail className="w-4 h-4 mr-2" />
              E-posta
            </TabsTrigger>
            <TabsTrigger 
              value="password" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              data-testid="tab-password"
            >
              <Lock className="w-4 h-4 mr-2" />
              Şifre
            </TabsTrigger>
            <TabsTrigger 
              value="codes" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
              data-testid="tab-codes"
            >
              <Code className="w-4 h-4 mr-2" />
              Kodlarım
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-black/50 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400">Profil Bilgileri</CardTitle>
                <CardDescription className="text-gray-400">
                  Adınız, soyadınız ve kullanıcı adınızı güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4">
                  {updateProfile.error && (
                    <Alert className="border-red-600 bg-red-950/50">
                      <AlertDescription className="text-red-400">
                        {(updateProfile.error as any)?.error || "Güncelleme başarısız"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {updateProfile.isSuccess && (
                    <Alert className="border-green-600 bg-green-950/50">
                      <AlertDescription className="text-green-400">
                        Profil bilgileriniz güncellendi
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-green-400">Ad</Label>
                      <Input
                        id="firstName"
                        className="bg-gray-900 border-green-800 text-white"
                        data-testid="input-firstName"
                        {...profileForm.register("firstName")}
                      />
                      {profileForm.formState.errors.firstName && (
                        <p className="text-sm text-red-400">
                          {profileForm.formState.errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-green-400">Soyad</Label>
                      <Input
                        id="lastName"
                        className="bg-gray-900 border-green-800 text-white"
                        data-testid="input-lastName"
                        {...profileForm.register("lastName")}
                      />
                      {profileForm.formState.errors.lastName && (
                        <p className="text-sm text-red-400">
                          {profileForm.formState.errors.lastName.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-green-400">Kullanıcı Adı</Label>
                    <Input
                      id="username"
                      className="bg-gray-900 border-green-800 text-white"
                      data-testid="input-username"
                      {...profileForm.register("username")}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-red-400">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={updateProfile.isPending}
                    data-testid="button-update-profile"
                  >
                    {updateProfile.isPending ? "Güncelleniyor..." : "Profili Güncelle"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="email">
            <Card className="bg-black/50 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400">E-posta Adresi</CardTitle>
                <CardDescription className="text-gray-400">
                  Mevcut e-posta: {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={emailForm.handleSubmit(handleChangeEmail)} className="space-y-4">
                  {changeEmail.error && (
                    <Alert className="border-red-600 bg-red-950/50">
                      <AlertDescription className="text-red-400">
                        {(changeEmail.error as any)?.error || "E-posta değiştirilemedi"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {changeEmail.isSuccess && (
                    <Alert className="border-green-600 bg-green-950/50">
                      <AlertDescription className="text-green-400">
                        E-posta adresiniz güncellendi
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="newEmail" className="text-green-400">Yeni E-posta</Label>
                    <Input
                      id="newEmail"
                      type="email"
                      className="bg-gray-900 border-green-800 text-white"
                      data-testid="input-newEmail"
                      {...emailForm.register("newEmail")}
                    />
                    {emailForm.formState.errors.newEmail && (
                      <p className="text-sm text-red-400">
                        {emailForm.formState.errors.newEmail.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailPassword" className="text-green-400">Mevcut Şifre</Label>
                    <div className="relative">
                      <Input
                        id="emailPassword"
                        type={showEmailPassword ? "text" : "password"}
                        className="bg-gray-900 border-green-800 text-white pr-10"
                        data-testid="input-emailPassword"
                        {...emailForm.register("password")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowEmailPassword(!showEmailPassword)}
                        data-testid="button-toggle-emailPassword"
                      >
                        {showEmailPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {emailForm.formState.errors.password && (
                      <p className="text-sm text-red-400">
                        {emailForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={changeEmail.isPending}
                    data-testid="button-change-email"
                  >
                    {changeEmail.isPending ? "Değiştiriliyor..." : "E-postayı Değiştir"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Password Tab */}
          <TabsContent value="password">
            <Card className="bg-black/50 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400">Şifre Değiştir</CardTitle>
                <CardDescription className="text-gray-400">
                  Hesabınızın güvenliği için güçlü bir şifre kullanın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(handleChangePassword)} className="space-y-4">
                  {changePassword.error && (
                    <Alert className="border-red-600 bg-red-950/50">
                      <AlertDescription className="text-red-400">
                        {(changePassword.error as any)?.error || "Şifre değiştirilemedi"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {changePassword.isSuccess && (
                    <Alert className="border-green-600 bg-green-950/50">
                      <AlertDescription className="text-green-400">
                        Şifreniz başarıyla değiştirildi
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-green-400">Mevcut Şifre</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        className="bg-gray-900 border-green-800 text-white pr-10"
                        data-testid="input-currentPassword"
                        {...passwordForm.register("currentPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        data-testid="button-toggle-currentPassword"
                      >
                        {showCurrentPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-400">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-green-400">Yeni Şifre</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        className="bg-gray-900 border-green-800 text-white pr-10"
                        data-testid="input-newPassword"
                        {...passwordForm.register("newPassword")}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        data-testid="button-toggle-newPassword"
                      >
                        {showNewPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-400" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-400">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-green-400">Yeni Şifre Tekrar</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        className="bg-gray-900 border-green-800 text-white pr-10"
                        data-testid="input-confirmPassword"
                        {...passwordForm.register("confirmPassword")}
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
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-400">
                        {passwordForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                    disabled={changePassword.isPending}
                    data-testid="button-change-password"
                  >
                    {changePassword.isPending ? "Değiştiriliyor..." : "Şifreyi Değiştir"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Codes Tab */}
          <TabsContent value="codes">
            <Card className="bg-black/50 border-green-800">
              <CardHeader>
                <CardTitle className="text-green-400">Kodlarım</CardTitle>
                <CardDescription className="text-gray-400">
                  Paylaştığınız kod örnekleri
                </CardDescription>
              </CardHeader>
              <CardContent>
                {codesLoading ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400">Kodlarınız yükleniyor...</div>
                  </div>
                ) : !userCodes || userCodes.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">Henüz hiç kod paylaşmadınız</div>
                    <Button 
                      onClick={() => window.location.href = "/paylas"} 
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-share-code"
                    >
                      İlk Kodunuzu Paylaşın
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userCodes.map((code) => (
                      <div
                        key={code.id}
                        className="p-4 border border-green-800 rounded-lg bg-gray-900/50"
                        data-testid={`code-card-${code.id}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-green-400">{code.title}</h3>
                          <div className="flex gap-2 text-sm text-gray-400">
                            <span>👁️ {code.views}</span>
                            <span>❤️ {code.likes}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 text-sm text-gray-400 mb-3">
                          <span className="bg-green-800 px-2 py-1 rounded text-xs">
                            {code.language}
                          </span>
                          <span className="bg-blue-800 px-2 py-1 rounded text-xs">
                            {code.category}
                          </span>
                        </div>
                        <pre className="bg-black/50 p-3 rounded text-sm text-gray-300 max-h-32 overflow-y-auto">
                          {code.code}
                        </pre>
                        <div className="mt-3 text-xs text-gray-500">
                          {new Date(code.createdAt).toLocaleDateString("tr-TR")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Logout Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={() => logout.mutate()}
            className="border-red-600 text-red-400 hover:bg-red-950"
            data-testid="button-logout"
          >
            Çıkış Yap
          </Button>
        </div>
      </div>
    </div>
  );
}