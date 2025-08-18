import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search as SearchIcon, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CodeSnippet } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [minRating, setMinRating] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const { data: searchResults = [], isLoading } = useQuery<CodeSnippet[]>({
    queryKey: ["/api/search", { q: searchQuery, language: searchLanguage, category: searchCategory }],
    enabled: isSearching && searchQuery.length > 0,
  });

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

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

  return (
    <section className="max-w-4xl mx-auto" data-testid="search-section">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-accent-green to-white bg-clip-text text-transparent">
          Kod Ara
        </h2>
        <p className="text-gray-300">Milyonlarca kod snippet arasından aradığınızı bulun</p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-400" size={20} />
        </div>
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Kod, etiket veya kullanıcı ara..."
          className="w-full pl-12 pr-4 py-4 bg-gray-800/50 text-white rounded-xl border border-accent-green/20 focus:border-accent-green text-lg"
          data-testid="search-input"
        />
        <Button
          onClick={handleSearch}
          className="absolute right-2 top-2 bottom-2 px-6 bg-accent-green hover:bg-light-green text-white rounded-lg"
          data-testid="search-button"
        >
          Ara
        </Button>
      </div>

      {/* Search Filters */}
      <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-accent-green/20 p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-white">Gelişmiş Filtreler</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Programlama Dili</label>
            <Select value={searchLanguage} onValueChange={setSearchLanguage}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="javascript">JavaScript</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="java">Java</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="typescript">TypeScript</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Kategori</label>
            <Select value={searchCategory} onValueChange={setSearchCategory}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
                <SelectValue placeholder="Tümü" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tümü</SelectItem>
                <SelectItem value="Web Development">Web Development</SelectItem>
                <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Algorithms">Algorithms</SelectItem>
                <SelectItem value="Utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Tarih Aralığı</label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full bg-gray-800 text-white border-accent-green/20 focus:border-accent-green">
                <SelectValue placeholder="Tüm zamanlar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tüm zamanlar</SelectItem>
                <SelectItem value="day">Son 24 saat</SelectItem>
                <SelectItem value="week">Son hafta</SelectItem>
                <SelectItem value="month">Son ay</SelectItem>
                <SelectItem value="year">Son yıl</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div data-testid="search-results">
        {isSearching && (
          <>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Arama Sonuçları</h3>
              <span className="text-gray-400" data-testid="results-count">
                {isLoading ? "Aranıyor..." : `${searchResults.length} sonuç bulundu`}
              </span>
            </div>

            {isLoading ? (
              <div className="text-center py-8" data-testid="search-loading">
                <div className="text-accent-green">Aranıyor...</div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-center py-8" data-testid="no-results">
                <p className="text-gray-400">Arama kriterlerinize uygun kod bulunamadı.</p>
              </div>
            ) : (
              <div className="space-y-4" data-testid="results-list">
                {searchResults.map((snippet) => (
                  <div
                    key={snippet.id}
                    className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl border border-accent-green/20 p-6 hover:border-accent-green/40 transition-all duration-300"
                    data-testid={`result-${snippet.id}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-lg font-semibold text-white mb-1">
                          {snippet.title}
                        </h4>
                        <p className="text-gray-300">{snippet.category}</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span className={`px-2 py-1 rounded ${getLanguageColor(snippet.language)}`}>
                          {snippet.language}
                        </span>
                        <span className="flex items-center">
                          ♥ {snippet.likes}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>
                        {formatDistanceToNow(new Date(snippet.createdAt), {
                          addSuffix: true,
                          locale: tr,
                        })}
                      </span>
                      <button
                        className="text-accent-green hover:text-white transition-colors flex items-center"
                        data-testid={`view-result-${snippet.id}`}
                      >
                        <ExternalLink className="mr-1" size={16} />
                        Kodu Görüntüle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {!isSearching && (
          <div className="text-center py-16" data-testid="search-prompt">
            <SearchIcon className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Arama yapmak için yukarıdaki kutucuğu kullanın</p>
          </div>
        )}
      </div>
    </section>
  );
}
