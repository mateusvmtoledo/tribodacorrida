export type RaceType = 'rua' | 'trilha' | 'hibrida' | 'ultramaratona' | 'duathlon' | 'triathlon';

export interface Race {
  id: string;
  name: string;
  type: RaceType;
  distance?: string;
  date: string;
  state: string;
  city: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  location: string;
  organizer: string;
  isFree?: boolean;
}

export const raceTypes: { value: RaceType; label: string }[] = [
  { value: 'rua', label: 'Corrida de Rua' },
  { value: 'trilha', label: 'Corrida de Trilha' },
  { value: 'hibrida', label: 'Corrida Híbrida' },
  { value: 'ultramaratona', label: 'Ultramaratona' },
  { value: 'duathlon', label: 'Duathlon' },
  { value: 'triathlon', label: 'Triathlon' },
];

export const distances = [
  { value: '5k', label: '5 km' },
  { value: '10k', label: '10 km' },
  { value: '21k', label: 'Meia Maratona (21 km)' },
  { value: '42k', label: 'Maratona (42 km)' },
  { value: '50k', label: '50 km' },
  { value: '100k', label: '100 km+' },
];

export const states = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export const citiesByState: Record<string, string[]> = {
  SP: ['São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Ribeirão Preto'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Búzios', 'Paraty'],
  MG: ['Belo Horizonte', 'Ouro Preto', 'Uberlândia', 'Juiz de Fora', 'Tiradentes'],
  RS: ['Porto Alegre', 'Gramado', 'Canela', 'Caxias do Sul', 'Pelotas'],
  PR: ['Curitiba', 'Foz do Iguaçu', 'Londrina', 'Maringá', 'Ponta Grossa'],
  SC: ['Florianópolis', 'Blumenau', 'Joinville', 'Balneário Camboriú', 'Chapecó'],
  BA: ['Salvador', 'Porto Seguro', 'Ilhéus', 'Lençóis', 'Itacaré'],
  PE: ['Recife', 'Olinda', 'Porto de Galinhas', 'Fernando de Noronha', 'Caruaru'],
  CE: ['Fortaleza', 'Jericoacoara', 'Canoa Quebrada', 'Juazeiro do Norte', 'Sobral'],
  DF: ['Brasília'],
};

// Dados mockados de corridas
export const mockRaces: Race[] = [
  {
    id: '1',
    name: 'São Paulo City Marathon',
    type: 'rua',
    distance: '42k',
    date: '2025-04-15',
    state: 'SP',
    city: 'São Paulo',
    price: 250,
    originalPrice: 320,
    image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
    description: 'A maior maratona da América Latina. Percorra as principais avenidas de São Paulo nesta corrida épica.',
    location: 'Av. Paulista - São Paulo',
    organizer: 'SP Running Events',
  },
  {
    id: '2',
    name: 'Trail Serra da Mantiqueira',
    type: 'trilha',
    distance: '21k',
    date: '2025-03-22',
    state: 'MG',
    city: 'Tiradentes',
    price: 180,
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    description: 'Desafie-se nas montanhas da Serra da Mantiqueira com vistas deslumbrantes.',
    location: 'Serra da Mantiqueira - Tiradentes',
    organizer: 'Mountain Runners',
  },
  {
    id: '3',
    name: 'Rio Night Run',
    type: 'rua',
    distance: '10k',
    date: '2025-02-28',
    state: 'RJ',
    city: 'Rio de Janeiro',
    price: 0,
    isFree: true,
    image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800',
    description: 'Corrida noturna pela orla carioca. Evento gratuito para toda a comunidade!',
    location: 'Praia de Copacabana - Rio de Janeiro',
    organizer: 'Rio Runners Club',
  },
  {
    id: '4',
    name: 'Ultra Trail Brasil 100k',
    type: 'ultramaratona',
    distance: '100k',
    date: '2025-06-10',
    state: 'RS',
    city: 'Gramado',
    price: 450,
    image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    description: 'O desafio definitivo para ultramaratonistas. 100km através da Serra Gaúcha.',
    location: 'Serra Gaúcha - Gramado',
    organizer: 'Ultra Brasil',
  },
  {
    id: '5',
    name: 'Duathlon Floripa',
    type: 'duathlon',
    date: '2025-05-18',
    state: 'SC',
    city: 'Florianópolis',
    price: 220,
    image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800',
    description: 'Combine corrida e ciclismo neste evento espetacular na Ilha da Magia.',
    location: 'Praia da Joaquina - Florianópolis',
    organizer: 'Floripa Multisport',
  },
  {
    id: '6',
    name: 'Triathlon Salvador',
    type: 'triathlon',
    date: '2025-07-05',
    state: 'BA',
    city: 'Salvador',
    price: 350,
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    description: 'Natação, ciclismo e corrida nas belíssimas praias de Salvador.',
    location: 'Praia do Porto da Barra - Salvador',
    organizer: 'Bahia Tri',
  },
  {
    id: '7',
    name: 'Corrida Híbrida Brasília',
    type: 'hibrida',
    distance: '15k',
    date: '2025-04-05',
    state: 'DF',
    city: 'Brasília',
    price: 120,
    image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    description: 'Mistura única de asfalto e trilha no coração do Brasil.',
    location: 'Parque da Cidade - Brasília',
    organizer: 'Brasília Running',
  },
  {
    id: '8',
    name: 'Meia Maratona Curitiba',
    type: 'rua',
    distance: '21k',
    date: '2025-03-15',
    state: 'PR',
    city: 'Curitiba',
    price: 150,
    originalPrice: 190,
    image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    description: 'Percorra os principais parques de Curitiba nesta meia maratona inesquecível.',
    location: 'Parque Barigui - Curitiba',
    organizer: 'Curitiba Run',
  },
];
