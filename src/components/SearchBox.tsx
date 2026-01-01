import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Route, Ruler } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { raceTypes, distances, states, citiesByState, RaceType } from '@/lib/races-data';

interface SearchBoxProps {
  className?: string;
  initialValues?: {
    type?: string;
    distance?: string;
    state?: string;
    city?: string;
  };
}

const SearchBox = ({ className = '', initialValues }: SearchBoxProps) => {
  const navigate = useNavigate();
  const [type, setType] = useState(initialValues?.type || '');
  const [distance, setDistance] = useState(initialValues?.distance || '');
  const [state, setState] = useState(initialValues?.state || '');
  const [city, setCity] = useState(initialValues?.city || '');
  const [cities, setCities] = useState<string[]>([]);

  const showDistance = ['rua', 'trilha', 'hibrida', 'ultramaratona'].includes(type);

  useEffect(() => {
    if (state && citiesByState[state]) {
      setCities(citiesByState[state]);
    } else {
      setCities([]);
      setCity('');
    }
  }, [state]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (distance && showDistance) params.append('distance', distance);
    if (state) params.append('state', state);
    if (city) params.append('city', city);
    
    navigate(`/resultados?${params.toString()}`);
  };

  return (
    <div className={`search-card ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Tipo de Corrida */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Route className="h-4 w-4" />
            Tipo de Corrida
          </label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {raceTypes.map((rt) => (
                <SelectItem key={rt.value} value={rt.value}>
                  {rt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Distância (condicional) */}
        <div className={`space-y-2 ${!showDistance ? 'opacity-50' : ''}`}>
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Distância
          </label>
          <Select value={distance} onValueChange={setDistance} disabled={!showDistance}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a distância" />
            </SelectTrigger>
            <SelectContent>
              {distances.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Estado */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Estado
          </label>
          <Select value={state} onValueChange={setState}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o estado" />
            </SelectTrigger>
            <SelectContent>
              {states.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cidade */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Cidade
          </label>
          <Select value={city} onValueChange={setCity} disabled={!state || cities.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botão Buscar */}
        <div className="flex items-end">
          <Button 
            onClick={handleSearch} 
            className="w-full h-10 btn-gradient"
          >
            <Search className="h-4 w-4 mr-2" />
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
