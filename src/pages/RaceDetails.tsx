import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, User, ArrowLeft, Tag, Clock, Camera, Trophy, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockRaces, upcomingRaces, raceTypes, Race } from '@/lib/races-data';
import RaceCard from '@/components/RaceCard';

// Mapa de vizinhos para recomendação inteligente
const stateNeighbors: Record<string, string[]> = {
  'AC': ['AM', 'RO'],
  'AL': ['PE', 'SE', 'BA'],
  'AM': ['AC', 'RO', 'MT', 'PA', 'RR'],
  'AP': ['PA'],
  'BA': ['AL', 'SE', 'PE', 'PI', 'TO', 'GO', 'MG', 'ES'],
  'CE': ['PI', 'RN', 'PB', 'PE'],
  'DF': ['GO', 'MG'],
  'ES': ['BA', 'MG', 'RJ'],
  'GO': ['TO', 'BA', 'MG', 'MS', 'MT', 'DF'],
  'MA': ['PA', 'TO', 'PI'],
  'MG': ['BA', 'ES', 'RJ', 'SP', 'MS', 'GO', 'DF'],
  'MS': ['MT', 'GO', 'MG', 'SP', 'PR'],
  'MT': ['RO', 'AM', 'PA', 'TO', 'GO', 'MS'],
  'PA': ['AP', 'MA', 'TO', 'MT', 'AM', 'RR'],
  'PB': ['RN', 'CE', 'PE'],
  'PE': ['PB', 'CE', 'PI', 'BA', 'AL'],
  'PI': ['MA', 'TO', 'BA', 'PE', 'CE'],
  'PR': ['MS', 'SP', 'SC'],
  'RJ': ['ES', 'MG', 'SP'],
  'RN': ['CE', 'PB'],
  'RO': ['AC', 'AM', 'MT'],
  'RR': ['AM', 'PA'],
  'RS': ['SC'],
  'SC': ['PR', 'RS'],
  'SE': ['AL', 'BA'],
  'SP': ['MG', 'RJ', 'PR', 'MS'],
  'TO': ['PA', 'MA', 'PI', 'BA', 'GO', 'MT']
};

const RaceDetails = () => {
  const { id } = useParams();
  const race = mockRaces.find((r) => r.id === id);

  // Verifica se a corrida já passou (Data anterior a hoje)
  const isPast = useMemo(() => {
    if (!race) return false;
    const raceDate = new Date(race.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return raceDate < today;
  }, [race]);

  // Lógica de Recomendação (12 corridas)
  const recommendedRaces = useMemo(() => {
    if (!race) return [];

    // 1. Filtra todas as corridas FUTURAS, exceto a atual
    const candidates = upcomingRaces.filter(r => r.id !== race.id);

    // Função auxiliar para embaralhar array
    const shuffle = (array: Race[]) => array.sort(() => 0.5 - Math.random());

    // 2. Prioridade 1: Mesmo Estado (Tenta pegar pelo menos 4)
    const sameState = shuffle(candidates.filter(r => r.state === race.state));

    // 3. Prioridade 2: Estados Vizinhos
    const neighborsList = stateNeighbors[race.state] || [];
    const neighbors = shuffle(candidates.filter(r => neighborsList.includes(r.state)));

    // 4. Prioridade 3: Resto do Brasil (Random)
    const others = shuffle(candidates.filter(r => r.state !== race.state && !neighborsList.includes(r.state)));

    // Montagem da lista final (Total 12)
    let finalSelection = [...sameState.slice(0, 4)]; // Pega até 4 do mesmo estado
    
    // Se não encheu 4 do mesmo estado, completa com vizinhos
    const remainingAfterState = 12 - finalSelection.length;
    finalSelection = [...finalSelection, ...neighbors.slice(0, remainingAfterState)];

    // Se ainda não deu 12 (porque faltou vizinhos), completa com o resto
    const remainingTotal = 12 - finalSelection.length;
    if (remainingTotal > 0) {
      finalSelection = [...finalSelection, ...others.slice(0, remainingTotal)];
    }

    return finalSelection;
  }, [race]);

  if (!race) {
    return (
      <main className="pt-24 pb-16 min-h-screen">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Corrida não encontrada</h1>
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
        {/* Breadcrumb / Voltar */}
        <Link to="/corridas" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para corridas
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal (Esquerda) */}
          <div className="lg:col-span-2">
            <div className="relative rounded-2xl overflow-hidden mb-8 shadow-md">
              <img
                src={race.image}
                alt={race.name}
                className={`w-full h-64 md:h-96 object-cover ${isPast ? 'grayscale-[30%]' : ''}`}
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
              {isPast && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                   <Badge className="text-xl py-2 px-6 bg-white text-black hover:bg-white">Evento Realizado</Badge>
                </div>
              )}
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

          {/* Sidebar (Direita) - Muda conteúdo se for Passado ou Futuro */}
          <div className="lg:col-span-1">
            <div className="glass-card rounded-2xl p-6 sticky top-24 border border-border/50 shadow-lg">
              
              {!isPast ? (
                // --- VISUAL FUTURO (Inscrição) ---
                <>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Tag className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Inscrição</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 flex-wrap">
                       {race.originalPrice && race.originalPrice > race.price && (
                        <span className="text-xl text-red-500 line-through font-medium">
                          {formatPrice(race.originalPrice)}
                        </span>
                      )}
                      <span className={`text-4xl font-bold ${race.isFree ? 'text-green-600' : 'text-foreground'}`}>
                        {formatPrice(race.price)}
                      </span>
                    </div>
                    {race.originalPrice && race.originalPrice > race.price && (
                      <Badge className="mt-2 bg-green-500 text-white hover:bg-green-600">
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
                      <Button className="w-full btn-gradient font-bold text-lg h-12 shadow-md hover:shadow-lg transition-all" size="lg">
                        Inscrever-se agora
                      </Button>
                    </a>
                  ) : (
                    <Button className="w-full btn-gradient mb-4 opacity-70" size="lg" disabled>
                      Inscrições indisponíveis
                    </Button>
                  )}

                  <p className="text-center text-sm text-muted-foreground">
                    Vagas limitadas. Garanta já a sua!
                  </p>
                </>
              ) : (
                // --- VISUAL PASSADO (Resultados e Fotos) ---
                <>
                  <div className="text-center mb-6">
                    <Trophy className="h-12 w-12 text-primary mx-auto mb-2" />
                    <h3 className="text-xl font-bold">Evento Finalizado</h3>
                    <p className="text-sm text-muted-foreground mt-1">Confira os resultados e fotos</p>
                  </div>

                  <div className="space-y-3">
                    {/* Botão de FOTOS */}
                    {race.photosLink ? (
                      <a href={race.photosLink} target="_blank" rel="noopener noreferrer" className="w-full block">
                        <Button variant="outline" size="lg" className="w-full flex gap-2 border-primary/20 hover:bg-primary/5 hover:border-primary">
                          <Camera className="h-5 w-5 text-primary" />
                          Ver Fotos Oficiais
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="lg" disabled className="w-full flex gap-2 opacity-60">
                         <Camera className="h-5 w-5" />
                         Fotos Indisponíveis
                      </Button>
                    )}

                    {/* Botão de RESULTADOS */}
                    {race.hasResults ? (
                       <Button className="w-full flex gap-2" size="lg">
                        <Trophy className="h-5 w-5" />
                        Ver Resultados
                      </Button>
                    ) : (
                      <Button variant="secondary" size="lg" disabled className="w-full flex gap-2 opacity-60">
                        <Trophy className="h-5 w-5" />
                        Resultados em breve
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* --- SEÇÃO DE RECOMENDAÇÕES --- */}
        {recommendedRaces.length > 0 && (
          <section className="mt-20 pt-10 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Corridas Recomendadas
                </h2>
                <p className="text-muted-foreground">
                  Eventos próximos a {race.state} que você pode gostar
                </p>
              </div>
              <Link to="/corridas">
                <Button variant="ghost" className="mt-4 md:mt-0 group">
                  Ver calendário completo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedRaces.map((recRace) => (
                <RaceCard key={recRace.id} race={recRace} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default RaceDetails;