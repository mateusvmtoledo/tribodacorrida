import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Ticket, Camera, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Race, raceTypes } from '@/lib/races-data';

interface RaceCardProps {
  race: Race;
  isPast?: boolean; // Nova propriedade para indicar se é histórico
}

const RaceCard = ({ race, isPast = false }: RaceCardProps) => {
  const raceTypeLabel = raceTypes.find((rt) => rt.value === race.type)?.label || race.type;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
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
    <div className="race-card flex flex-col h-full">
      <div className="relative h-48 overflow-hidden shrink-0">
        <img
          src={race.customImage || race.image}
          alt={race.name}
          className={`w-full h-full object-cover transition-transform duration-500 hover:scale-110 ${isPast ? 'grayscale-[50%]' : ''}`}
        />
        
        {/* Container das Badges */}
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start gap-2 z-10 pointer-events-none">
          <div className="flex flex-wrap gap-2 max-w-[70%] pointer-events-auto">
            <Badge className="bg-primary/90 hover:bg-primary text-primary-foreground backdrop-blur-sm shadow-sm whitespace-nowrap">
              {raceTypeLabel}
            </Badge>
            {race.distance && (
              <Badge variant="secondary" className="bg-black/70 text-white hover:bg-black/80 backdrop-blur-sm shadow-sm font-semibold whitespace-normal text-left">
                {race.distance.toUpperCase()}
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0 pointer-events-auto">
            {!isPast && race.isFree && (
              <Badge className="bg-green-500/90 text-white backdrop-blur-sm shadow-sm whitespace-nowrap">
                Gratuito
              </Badge>
            )}
            {!isPast && race.hasCoupon && (
              <Badge className="bg-secondary/90 text-secondary-foreground animate-pulse backdrop-blur-sm shadow-sm whitespace-nowrap">
                <Ticket className="h-3 w-3 mr-1" />
                Cupom
              </Badge>
            )}
             {isPast && (
              <Badge className="bg-gray-600/90 text-white backdrop-blur-sm shadow-sm whitespace-nowrap">
                Finalizada
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 h-[3.5rem]">{race.name}</h3>

        <div className="space-y-2 text-sm text-muted-foreground mb-4 flex-grow">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary shrink-0" />
            <span>{formatDate(race.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary shrink-0" />
            <span className="line-clamp-1">{race.city}, {race.state}</span>
          </div>
        </div>

        {/* Rodapé Dinâmico: Futuro vs Passado */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center justify-between pt-4 border-t border-border gap-3 mt-auto">
          
          {/* Se NÃO for passado, mostra preço */}
          {!isPast ? (
            <>
              <div className="flex items-center gap-2 min-w-0 w-full sm:w-auto">
                <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex flex-wrap items-baseline gap-x-2">
                  {race.originalPrice && race.originalPrice > race.price ? (
                    <>
                      <span className="text-xs text-red-500 line-through whitespace-nowrap font-medium">
                        {formatPrice(race.originalPrice)}
                      </span>
                      <span className="font-bold text-lg text-green-600 whitespace-nowrap">
                        {formatPrice(race.price)}
                      </span>
                    </>
                  ) : (
                    <span className={`font-bold text-lg whitespace-nowrap ${race.isFree ? 'text-green-600' : 'text-foreground'}`}>
                      {formatPrice(race.price)}
                    </span>
                  )}
                </div>
              </div>
              
              <Link to={`/corrida/${race.id}`} className="w-full sm:w-auto">
                <Button variant="outline" size="sm" className="w-full sm:w-auto whitespace-nowrap">
                  Mais Detalhes
                </Button>
              </Link>
            </>
          ) : (
            /* MODO PASSADO (RESULTADOS) */
            <div className="w-full grid grid-cols-2 gap-2">
              {/* Botão de FOTOS (Condicional) */}
              {race.photosLink ? (
                <a href={race.photosLink} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button variant="outline" size="sm" className="w-full flex gap-2">
                    <Camera className="h-4 w-4" />
                    Ver Fotos
                  </Button>
                </a>
              ) : (
                <Button variant="outline" size="sm" disabled className="w-full opacity-50 cursor-not-allowed">
                   <Camera className="h-4 w-4 mr-2" />
                   Sem Fotos
                </Button>
              )}

              {/* Botão de RESULTADOS (Condicional - Admin) */}
              {race.hasResults ? (
                <Link to={`/corrida/${race.id}`} className="w-full">
                  <Button variant="default" size="sm" className="w-full flex gap-2">
                    <Trophy className="h-4 w-4" />
                    Resultado
                  </Button>
                </Link>
              ) : (
                <Button variant="secondary" size="sm" disabled className="w-full opacity-50 cursor-not-allowed">
                  Indisponível
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaceCard;