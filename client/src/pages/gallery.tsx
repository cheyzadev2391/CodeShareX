import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CodeCard from "@/components/code-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CodeSnippet } from "@shared/schema";

export default function Gallery() {
  const [languageFilter, setLanguageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: snippets = [], isLoading } = useQuery<CodeSnippet[]>({
    queryKey: ["/api/code"],
  });

  const likeMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("POST", `/api/code/${id}/like`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/code"] });
    },
    onError: () => {
      toast({
        title: "Hata",
        description: "Beğeni eklenirken bir hata oluştu.",
        variant: "destructive",
      });
    },
  });

  const filteredSnippets = snippets.filter((snippet) => {
    const matchesLanguage = languageFilter === "all" || snippet.language === languageFilter;
    const matchesCategory = categoryFilter === "all" || snippet.category === categoryFilter;
    return matchesLanguage && matchesCategory;
  });

  const sortedSnippets = [...filteredSnippets].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.views - a.views;
      case "rating":
        return b.likes - a.likes;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const itemsPerPage = 6;
  const totalPages = Math.ceil(sortedSnippets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSnippets = sortedSnippets.slice(startIndex, startIndex + itemsPerPage);

  const handleLike = (id: string) => {
    likeMutation.mutate(id);
  };

  const handleView = (id: string) => {
    // Increment view count and show code details
    toast({
      title: "Kod Detayları",
      description: `Kod ID: ${id} - Detayları görüntüleniyor...`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64" data-testid="loading-indicator">
        <div className="text-accent-green text-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <section data-testid="gallery-section">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-green to-white bg-clip-text text-transparent">
          Kod Galerisi
        </h2>
        <p className="text-gray-300">Topluluk tarafından paylaşılan kod örneklerini keşfedin</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">Dil:</span>
          <Select value={languageFilter} onValueChange={setLanguageFilter}>
            <SelectTrigger className="w-32 bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
              <SelectValue placeholder="Tümü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">Kategori:</span>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
              <SelectValue placeholder="Tümü" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tümü</SelectItem>
              <SelectItem value="Web Development">Web Development</SelectItem>
              <SelectItem value="Mobile Development">Mobile Development</SelectItem>
              <SelectItem value="Data Science">Data Science</SelectItem>
              <SelectItem value="Algorithms">Algorithms</SelectItem>
              <SelectItem value="Utilities">Utilities</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-gray-300">Sıralama:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">En Yeni</SelectItem>
              <SelectItem value="popular">Popüler</SelectItem>
              <SelectItem value="rating">En Çok Beğenilen</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Code Cards Grid */}
      {paginatedSnippets.length === 0 ? (
        <div className="text-center py-16" data-testid="empty-state">
          <p className="text-gray-400 text-lg">Henüz paylaşılan kod bulunmuyor.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8" data-testid="code-grid">
          {paginatedSnippets.map((snippet) => (
            <CodeCard
              key={snippet.id}
              snippet={snippet}
              onView={handleView}
              onLike={handleLike}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2" data-testid="pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
            data-testid="prev-page"
          >
            <ChevronLeft size={16} />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={
                currentPage === page
                  ? "bg-accent-green text-white"
                  : "bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
              }
              data-testid={`page-${page}`}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700"
            data-testid="next-page"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </section>
  );
}
