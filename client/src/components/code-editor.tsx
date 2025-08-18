import { useEffect, useRef, useState } from "react";
import { Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CodeEditorProps {
  initialValue?: string;
  language?: string;
  onSave?: (code: string, title: string, language: string) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  onLanguageChange?: (language: string) => void;
}

declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}

export default function CodeEditor({
  initialValue = "// Kodunuzu buraya yazın...\nfunction hello() {\n    console.log('Merhaba MinuslarDev!');\n}",
  language = "javascript",
  onSave,
  title = "",
  onTitleChange,
  onLanguageChange,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [currentTitle, setCurrentTitle] = useState(title);
  const [currentLanguage, setCurrentLanguage] = useState(language);
  const { toast } = useToast();

  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "csharp", label: "C#" },
    { value: "php", label: "PHP" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
    { value: "sql", label: "SQL" },
    { value: "typescript", label: "TypeScript" },
  ];

  useEffect(() => {
    // Load Monaco Editor
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs/loader.js";
    script.onload = () => {
      window.require.config({
        paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.34.1/min/vs" },
      });
      window.require(["vs/editor/editor.main"], () => {
        if (editorRef.current) {
          const monacoEditor = window.monaco.editor.create(editorRef.current, {
            value: initialValue,
            language: currentLanguage,
            theme: "vs-dark",
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          });
          setEditor(monacoEditor);
        }
      });
    };
    document.head.appendChild(script);

    return () => {
      if (editor) {
        editor.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (editor && currentLanguage) {
      window.monaco.editor.setModelLanguage(editor.getModel(), currentLanguage);
    }
  }, [editor, currentLanguage]);

  const handleCopy = async () => {
    if (editor) {
      const code = editor.getValue();
      try {
        await navigator.clipboard.writeText(code);
        toast({
          title: "Başarılı",
          description: "Kod panoya kopyalandı!",
        });
      } catch (err) {
        toast({
          title: "Hata",
          description: "Kopyalama başarısız",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = () => {
    if (editor && onSave) {
      const code = editor.getValue();
      onSave(code, currentTitle, currentLanguage);
    }
  };

  const handleLanguageChange = (newLanguage: string) => {
    setCurrentLanguage(newLanguage);
    onLanguageChange?.(newLanguage);
  };

  const handleTitleChange = (newTitle: string) => {
    setCurrentTitle(newTitle);
    onTitleChange?.(newTitle);
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl border border-accent-green/20 overflow-hidden">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-accent-green/20">
        <div className="flex items-center space-x-4">
          <select
            value={currentLanguage}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-accent-green/20 focus:border-accent-green outline-none"
            data-testid="language-select"
          >
            {languages.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={currentTitle}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Kod başlığı..."
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-accent-green/20 focus:border-accent-green outline-none flex-1 min-w-64"
            data-testid="code-title-input"
          />
        </div>
        <div className="flex items-center space-x-3">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="sm"
            className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600"
            data-testid="copy-button"
          >
            <Copy className="mr-2" size={16} />
            Kopyala
          </Button>
          <Button
            onClick={handleSave}
            size="sm"
            className="bg-accent-green hover:bg-light-green text-white"
            data-testid="save-button"
          >
            <Save className="mr-2" size={16} />
            Kaydet
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div ref={editorRef} className="h-96 w-full" data-testid="monaco-editor" />
    </div>
  );
}
