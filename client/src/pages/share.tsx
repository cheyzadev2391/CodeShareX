import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/code-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogIn, UserPlus } from "lucide-react";
import { InsertCodeSnippet } from "@shared/schema";

export default function Share() {
  const { user, isAuthenticated } = useAuth();
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // If user is not authenticated, show authentication prompt
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 py-12">
        <Card className="max-w-md mx-auto bg-black/50 border-green-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-green-400 mb-4">
              Kod Paylaşmak İçin Giriş Yapın
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert className="border-green-600 bg-green-950/50">
              <AlertDescription className="text-green-400">
                Kod paylaşabilmek için hesabınıza giriş yapmanız gerekmektedir.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col gap-3">
              <Link href="/giris-yap" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700" data-testid="button-login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Giriş Yap
                </Button>
              </Link>
              
              <Link href="/kayit-ol" className="w-full">
                <Button variant="outline" className="w-full border-green-800 text-green-400 hover:bg-green-950" data-testid="button-register">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Kayıt Ol
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const createCodeMutation = useMutation({
    mutationFn: async (data: InsertCodeSnippet) => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Kod kaydedilemedi");
      }

      return response.json();
    },
    onSuccess: (newSnippet) => {
      toast({
        title: "Başarılı!",
        description: `Kod başarıyla kaydedildi! ID: ${newSnippet.id}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/code"] });
      
      // Reset form
      setTitle("");
      setCode("");
      setTags("");
    },
    onError: (error) => {
      toast({
        title: "Hata",
        description: "Kod kaydedilemedi. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      console.error("Error creating code snippet:", error);
    },
  });

  const handleSave = (editorCode: string, editorTitle: string, editorLanguage: string) => {
    if (!editorCode.trim()) {
      toast({
        title: "Hata",
        description: "Kod alanı boş olamaz.",
        variant: "destructive",
      });
      return;
    }

    if (!editorTitle.trim()) {
      toast({
        title: "Hata",
        description: "Kod başlığı boş olamaz.",
        variant: "destructive",
      });
      return;
    }

    const codeData: InsertCodeSnippet = {
      title: editorTitle,
      code: editorCode,
      language: editorLanguage,
      category,
      tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
      isPublic,
      allowComments,
    };

    createCodeMutation.mutate(codeData);
  };

  return (
    <section data-testid="share-section">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-green to-white bg-clip-text text-transparent">
            Kod Paylaş
          </h2>
          <p className="text-gray-300">Kodunuzu düzenleyin, kaydedin ve toplulukla paylaşın</p>
        </div>

        {/* Code Editor Container */}
        <CodeEditor
          onSave={handleSave}
          title={title}
          onTitleChange={setTitle}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Code Settings */}
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6 rounded-xl border border-accent-green/20">
            <h3 className="text-lg font-semibold mb-4 text-white">Kod Ayarları</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category" className="text-sm text-gray-300 mb-2">
                  Kategori
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
                    <SelectValue placeholder="Kategori seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                    <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                    <SelectItem value="Data Science">Data Science</SelectItem>
                    <SelectItem value="Algorithms">Algorithms</SelectItem>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tags" className="text-sm text-gray-300 mb-2">
                  Etiketler
                </Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="javascript, react, tutorial..."
                  className="w-full bg-gray-800 text-white border-accent-green/20 focus:border-accent-green"
                  data-testid="tags-input"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 p-6 rounded-xl border border-accent-green/20">
            <h3 className="text-lg font-semibold mb-4 text-white">Paylaşım Ayarları</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="public" className="text-gray-300">
                  Herkese açık
                </Label>
                <Switch
                  id="public"
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  data-testid="public-switch"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="comments" className="text-gray-300">
                  Yorum izni
                </Label>
                <Switch
                  id="comments"
                  checked={allowComments}
                  onCheckedChange={setAllowComments}
                  data-testid="comments-switch"
                />
              </div>
            </div>
          </div>
        </div>

        {createCodeMutation.isPending && (
          <div className="mt-6 text-center text-accent-green" data-testid="saving-indicator">
            Kod kaydediliyor...
          </div>
        )}
      </div>
    </section>
  );
}
