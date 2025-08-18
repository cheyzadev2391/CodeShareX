import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CodeEditor from "@/components/code-editor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { InsertCodeSnippet } from "@shared/schema";

export default function Share() {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [tags, setTags] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createCodeMutation = useMutation({
    mutationFn: async (data: InsertCodeSnippet) => {
      const response = await apiRequest("POST", "/api/code", data);
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
