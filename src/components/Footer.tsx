import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, Mail } from 'lucide-react';
import icon from '@/assets/icon.png';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src={icon} alt="Tribo da Corrida" className="h-12 w-auto" />
              <div>
                <h3 className="text-xl font-bold">Tribo da Corrida</h3>
                <p className="text-sm text-background/70">Conectando corredores a eventos</p>
              </div>
            </div>
            <p className="text-background/60 text-sm max-w-md">
              O maior portal de corridas do Brasil. Encontre sua próxima prova, 
              cadastre seu evento e faça parte da nossa tribo!
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/" className="hover:text-background transition-colors">Início</Link></li>
              <li><Link to="/resultados" className="hover:text-background transition-colors">Buscar Corridas</Link></li>
              <li><Link to="/cadastrar" className="hover:text-background transition-colors">Cadastrar Corrida</Link></li>
              <li><Link to="/contato" className="hover:text-background transition-colors">Contato</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Redes Sociais</h4>
            <div className="flex gap-4">
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/70 hover:text-secondary transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-8 pt-8 text-center text-sm text-background/50">
          <p>© {new Date().getFullYear()} Tribo da Corrida. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
