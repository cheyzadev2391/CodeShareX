import { Heart, MessageCircle, Eye, ExternalLink } from "lucide-react";
import { CodeSnippet } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

interface CodeCardProps {
  snippet: CodeSnippet;
  onView?: (id: string) => void;
  onLike?: (id: string) => void;
}

export default function CodeCard({ snippet, onView, onLike }: CodeCardProps) {
  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      javascript: "bg-yellow-500/20 text-yellow-400",
      python: "bg-blue-500/20 text-blue-400",
      java: "bg-red-500/20 text-red-400",
      cpp: "bg-purple-500/20 text-purple-400",
      csharp: "bg-green-500/20 text-green-400",
      php: "bg-indigo-500/20 text-indigo-400",
      html: "bg-orange-500/20 text-orange-400",
      css: "bg-pink-500/20 text-pink-400",
      sql: "bg-cyan-500/20 text-cyan-400",
      typescript: "bg-blue-600/20 text-blue-300",
    };
    return colors[language] || "bg-gray-500/20 text-gray-400";
  };

  const handleView = () => {
    onView?.(snippet.id);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    onLike?.(snippet.id);
  };

  return (
    <div
      className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-accent-green/20 overflow-hidden hover:border-accent-green/40 transition-all duration-300 hover:transform hover:scale-[1.02] cursor-pointer"
      onClick={handleView}
      data-testid={`code-card-${snippet.id}`}
    >
      <div className="p-4 border-b border-accent-green/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-white" data-testid={`code-title-${snippet.id}`}>
            {snippet.title}
          </h3>
          <span className={`text-xs px-2 py-1 rounded ${getLanguageColor(snippet.language)}`}>
            {snippet.language}
          </span>
        </div>
        <p className="text-sm text-gray-400" data-testid={`code-category-${snippet.id}`}>
          {snippet.category}
        </p>
      </div>
      <div className="p-4">
        <pre className="text-sm text-gray-300 bg-gray-900/50 p-3 rounded overflow-x-auto line-clamp-6">
          <code>{snippet.code.substring(0, 200)}...</code>
        </pre>
      </div>
      <div className="p-4 border-t border-accent-green/20 flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <button
            onClick={handleLike}
            className="flex items-center space-x-1 hover:text-red-400 transition-colors"
            data-testid={`like-button-${snippet.id}`}
          >
            <Heart size={16} />
            <span>{snippet.likes}</span>
          </button>
          <span className="flex items-center space-x-1">
            <Eye size={16} />
            <span>{snippet.views}</span>
          </span>
          <span className="text-xs">
            {formatDistanceToNow(new Date(snippet.createdAt), { addSuffix: true, locale: tr })}
          </span>
        </div>
        <button
          onClick={handleView}
          className="text-accent-green hover:text-white transition-colors"
          data-testid={`view-button-${snippet.id}`}
        >
          <ExternalLink size={16} />
        </button>
      </div>
    </div>
  );
}
