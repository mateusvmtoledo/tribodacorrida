import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Race, raceTypes } from '@/lib/races-data';

interface RaceCardProps {
  race: Race;
}

const RaceCard = ({ race }: RaceCardProps) => {
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
    <div className="race-card">
      <div className="relative h-48 overflow-hidden">
        <img
          src={race.image}
          alt={race.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {raceTypeLabel}
          </Badge>
          {race.distance && (
            <Badge variant="secondary" className="bg-card/90">
              {race.distance.toUpperCase()}
            </Badge>
          )}
        </div>
        {race.isFree && (
          <Badge className="absolute top-3 right-3 bg-green-500 text-white">
            Gratuito
          </Badge>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">{race.name}</h3>

        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{formatDate(race.date)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary" />
            <span>{race.city}, {race.state}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-muted-foreground" />
            <div>
              <span className={`font-bold text-lg ${race.isFree ? 'text-green-600' : 'text-foreground'}`}>
                {formatPrice(race.price)}
              </span>
              {race.originalPrice && race.originalPrice > race.price && (
                <span className="text-sm text-muted-foreground line-through ml-2">
                  {formatPrice(race.originalPrice)}
                </span>
              )}
            </div>
          </div>
          <Link to={`/corrida/${race.id}`}>
            <Button variant="outline" size="sm">
              Mais Detalhes
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RaceCard;
