import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, Tag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRaces, raceTypes } from '@/lib/races-data';

const RaceDetails = () => {
  const { id } = useParams();
  const race = mockRaces.find((r) => r.id === id);

  if (!race) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Corrida não encontrada</h1>
          {/* LINK ATUALIZADO */}
          <Link to="/corridas">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para corridas
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const raceTypeLabel = raceTypes.find((rt) => rt.value === race.type)?.label || race.type;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratuito';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* LINK ATUALIZADO */}
        <Link to="/corridas" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para corridas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden mb-8">
              <img
                src={race.image}
                alt={race.name}
                className="w-full h-64 md:h-96 object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className="bg-primary text-primary-foreground">
                  {raceTypeLabel}
                </Badge>
                {race.distance && (
                  <Badge variant="secondary" className="bg-card/90">
                    {race.distance.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">{race.name}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-semibold capitalize">{formatDate(race.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <MapPin className="h-6 w-6 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Local</p>
                  <p className="font-semibold">{race.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <User className="h-6 w-6 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Organizador</p>
                  <p className="font-semibold">{race.organizer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-muted rounded-xl">
                <Clock className="h-6 w-6 text-secondary" />
                <div>
                  <p className="text-sm text-muted-foreground">Cidade</p>
                  <p className="font-semibold">{race.city}, {race.state}</p>
                </div>
              </div>
            </div>

            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">Sobre o evento</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {race.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Tag className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Inscrição</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className={`text-4xl font-bold ${race.isFree ? 'text-green-600' : 'text-foreground'}`}>
                    {formatPrice(race.price)}
                  </span>
                  {race.originalPrice && race.originalPrice > race.price && (
                    <span className="text-xl text-muted-foreground line-through">
                      {formatPrice(race.originalPrice)}
                    </span>
                  )}
                </div>
                {race.originalPrice && race.originalPrice > race.price && (
                  <Badge className="mt-2 bg-green-500 text-white">
                    {Math.round((1 - race.price / race.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>

              {race.link ? (
                <a 
                  href={race.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-full block mb-4"
                >
                  <Button className="w-full btn-gradient" size="lg">
                    Inscrever-se agora
                  </Button>
                </a>
              ) : (
                <Button className="w-full btn-gradient mb-4" size="lg" disabled>
                  Inscrições indisponíveis
                </Button>
              )}

              <p className="text-center text-sm text-muted-foreground">
                Vagas limitadas. Garanta já a sua!
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default RaceDetails;