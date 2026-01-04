import { useMemo } from 'react';
import { ArrowRight, Users, Calendar, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-running.jpg';
import SearchBox from '@/components/SearchBox';
import RaceCard from '@/components/RaceCard';
import PartnersSlider from '@/components/PartnersSlider';
import { Button } from '@/components/ui/button';
import { upcomingRaces } from '@/lib/races-data';

const Index = () => {
  const featuredRaces = useMemo(() => {
    const shuffled = [...upcomingRaces];
    shuffled.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 12);
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="hero-overlay absolute inset-0" />
        
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-3xl text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-fade-in">
              Encontre sua próxima{' '}
              <span className="gradient-text">corrida</span>
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-fade-in">
              O maior portal de corridas do Brasil. Descubra eventos de rua, trilha, 
              ultramaratonas e muito mais perto de você!
            </p>
          </div>

          <div className="mt-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SearchBox />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">500+</h3>
              <p className="text-muted-foreground">Eventos cadastrados</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">50.000+</h3>
              <p className="text-muted-foreground">Corredores ativos</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">27</h3>
              <p className="text-muted-foreground">Estados cobertos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Races */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Corridas em <span className="gradient-text">Destaque</span>
              </h2>
              <p className="text-muted-foreground">
                Confira uma seleção especial de eventos para você
              </p>
            </div>
            {/* LINK ATUALIZADO PARA /corridas */}
            <Link to="/corridas">
              <Button variant="outline" className="mt-4 md:mt-0">
                Ver todas as corridas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/corridas">
              <Button variant="secondary" size="lg" className="w-full">
                Ver mais eventos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PartnersSlider />

      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
            Organizador de eventos?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Cadastre sua corrida gratuitamente e alcance milhares de corredores em todo o Brasil!
          </p>
          <Link to="/cadastrar">
            <Button size="lg" variant="secondary" className="font-semibold">
              Cadastrar minha corrida
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
};

export default Index;