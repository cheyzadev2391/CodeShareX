import { Code, Search, Zap, Palette, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HomeProps {
  onNavigate: (section: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  return (
    <section data-testid="home-section">
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-accent-green via-white to-accent-green bg-clip-text text-transparent">
          Kod Paylaşımının Yeni Adresi
        </h2>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          MinuslarDev ile kodlarınızı kolayca paylaşın, keşfedin ve toplulukla etkileşime geçin.
          Açık kaynak, modern ve kullanıcı dostu platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => onNavigate('share')}
            size="lg"
            className="px-8 py-4 bg-gradient-to-r from-accent-green to-light-green text-white font-semibold rounded-xl hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-accent-green/25"
            data-testid="button-share-code"
          >
            <Code className="mr-2" size={20} />
            Hemen Kod Paylaş
          </Button>
          <Button
            onClick={() => onNavigate('gallery')}
            variant="outline"
            size="lg"
            className="px-8 py-4 border-2 border-accent-green text-accent-green font-semibold rounded-xl hover:bg-accent-green hover:text-white transition-all duration-300"
            data-testid="button-explore-codes"
          >
            <Search className="mr-2" size={20} />
            Kodları Keşfet
          </Button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-accent-green/20 hover:border-accent-green/40 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
            <Zap className="text-accent-green" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Hızlı Paylaşım</h3>
          <p className="text-gray-300">
            Kodunuzu anında paylaşın ve direkt link alın. Tek tıkla panoya kopyalama.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-accent-green/20 hover:border-accent-green/40 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
            <Palette className="text-accent-green" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Syntax Highlighting</h3>
          <p className="text-gray-300">
            100+ programlama dili desteği ile kodlarınız her zaman okunabilir.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-accent-green/20 hover:border-accent-green/40 transition-all duration-300 hover:transform hover:scale-105">
          <div className="w-12 h-12 bg-accent-green/20 rounded-lg flex items-center justify-center mb-4">
            <Users className="text-accent-green" size={24} />
          </div>
          <h3 className="text-xl font-semibold mb-3 text-white">Topluluk</h3>
          <p className="text-gray-300">
            Açık kaynak toplulukla birlikte geliştirin ve öğrenin.
          </p>
        </div>
      </div>
    </section>
  );
}
