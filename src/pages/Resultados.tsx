import { useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { Filter } from 'lucide-react';
import SearchBox from '@/components/SearchBox';
import RaceCard from '@/components/RaceCard';
import { mockRaces, raceTypes } from '@/lib/races-data';

const Resultados = () => {
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type') || '';
  const distance = searchParams.get('distance') || '';
  const state = searchParams.get('state') || '';
  const city = searchParams.get('city') || '';

  const filteredRaces = useMemo(() => {
    return mockRaces.filter((race) => {
      if (type && race.type !== type) return false;
      if (distance && race.distance !== distance) return false;
      if (state && race.state !== state) return false;
      if (city && race.city !== city) return false;
      return true;
    });
  }, [type, distance, state, city]);

  const raceTypeLabel = raceTypes.find((rt) => rt.value === type)?.label;

  const getResultsTitle = () => {
    const parts = [];
    if (raceTypeLabel) parts.push(raceTypeLabel);
    if (city && state) parts.push(`em ${city}, ${state}`);
    else if (state) parts.push(`em ${state}`);
    
    return parts.length > 0 ? parts.join(' ') : 'Todas as corridas';
  };

  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Search Box */}
        <SearchBox
          initialValues={{ type, distance, state, city }}
          className="mb-8"
        />

        {/* Results Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              {getResultsTitle()}
            </h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {filteredRaces.length} {filteredRaces.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
            </p>
          </div>
        </div>

        {/* Results Grid */}
        {filteredRaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRaces.map((race) => (
              <RaceCard key={race.id} race={race} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
              <Filter className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Nenhuma corrida encontrada</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Tente ajustar os filtros de busca ou explore outras opções disponíveis.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Resultados;
