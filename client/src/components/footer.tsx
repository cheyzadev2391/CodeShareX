import { Code } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-accent-green/20 bg-gradient-to-r from-dark-green/50 to-black/50">
      <div className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-green to-light-green rounded-lg flex items-center justify-center">
                <Code className="text-white text-sm" size={16} />
              </div>
              <h3 className="text-xl font-bold text-white">MinuslarDev</h3>
            </div>
            <p className="text-gray-300">
              Açık kaynak kod paylaşım platformu. Toplulukla birlikte öğrenin ve geliştirin.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Hızlı Linkler</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  Kod Paylaş
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  Galeri
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  API Dökümanı
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-4">İletişim</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  Discord
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent-green transition-colors">
                  E-posta
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-green/20 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; 2024 MinuslarDev. Tüm hakları saklıdır. Açık kaynak lisansı ile sunulmaktadır.</p>
        </div>
      </div>
    </footer>
  );
}
