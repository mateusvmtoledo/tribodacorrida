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
  SP: ['São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Ribeirão Preto', 'Atibaia', 'Monte Alegre do Sul', 'Monte Azul Paulista', 'Itapira', 'Guaratinguetá', 'Itirapina', 'Socorro', 'Jaguariúna', 'Piracaia', 'Amparo', 'Pedreira', 'Jarinu', 'Extrema', 'Morungaba', 'Nazaré Paulista', 'Vargem', 'Pindamonhangaba', 'Bragança Paulista', 'Itatiba'],
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

// Imagens para corridas
const raceImages = {
  rua: [
    'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800',
    'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800',
    'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800',
  ],
  trilha: [
    'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800',
    'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800',
    'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800',
  ],
};

const getRandomImage = (type: RaceType): string => {
  const images = raceImages[type as keyof typeof raceImages] || raceImages.rua;
  return images[Math.floor(Math.random() * images.length)];
};

const getCityFromName = (name: string): string => {
  if (name.includes('Atibaia')) return 'Atibaia';
  if (name.includes('Monte Alegre do Sul')) return 'Monte Alegre do Sul';
  if (name.includes('Monte Azul Paulista')) return 'Monte Azul Paulista';
  if (name.includes('Itapira')) return 'Itapira';
  if (name.includes('Guaratinguetá')) return 'Guaratinguetá';
  if (name.includes('Itirapina')) return 'Itirapina';
  if (name.includes('Socorro')) return 'Socorro';
  if (name.includes('Jaguariúna')) return 'Jaguariúna';
  if (name.includes('Piracaia')) return 'Piracaia';
  if (name.includes('Amparo')) return 'Amparo';
  if (name.includes('Pedreira')) return 'Pedreira';
  if (name.includes('Jarinu')) return 'Jarinu';
  if (name.includes('Extrema')) return 'Extrema';
  if (name.includes('Morungaba')) return 'Morungaba';
  if (name.includes('Nazaré Paulista')) return 'Nazaré Paulista';
  if (name.includes('Vargem')) return 'Vargem';
  if (name.includes('Pindamonhangaba')) return 'Pindamonhangaba';
  if (name.includes('Bragança')) return 'Bragança Paulista';
  if (name.includes('Itatiba')) return 'Itatiba';
  if (name.includes('Paulista')) return 'São Paulo';
  return 'São Paulo';
};

// Dados das corridas
export const mockRaces: Race[] = [
  { id: '1', name: '3ª Corrida Kids Atibaia', type: 'rua', date: '2025-01-05', state: 'SP', city: 'Atibaia', price: 50, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Corrida especial para crianças em Atibaia. Venha participar com sua família!', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '2', name: '3ª Corrida Pedestre Monte Alegre do Sul', type: 'rua', date: '2025-01-12', state: 'SP', city: 'Monte Alegre do Sul', price: 80, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida pedestre tradicional de Monte Alegre do Sul.', location: 'Praça Central - Monte Alegre do Sul', organizer: 'Monte Alegre Runners' },
  { id: '3', name: '3ª Corrida Rústica Brigadeiro Faria Lima', type: 'rua', date: '2025-01-19', state: 'SP', city: 'São Paulo', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Corrida rústica pela famosa Avenida Brigadeiro Faria Lima.', location: 'Av. Brigadeiro Faria Lima - São Paulo', organizer: 'SP Running Events' },
  { id: '4', name: '3ª Etapa Circuito Paulista de Corridas', type: 'rua', date: '2025-01-26', state: 'SP', city: 'São Paulo', price: 150, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Terceira etapa do tradicional Circuito Paulista de Corridas.', location: 'Parque Ibirapuera - São Paulo', organizer: 'Circuito Paulista' },
  { id: '5', name: '3ª Meia Maratona de Atibaia', type: 'rua', distance: '21k', date: '2025-02-02', state: 'SP', city: 'Atibaia', price: 180, originalPrice: 220, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Meia maratona pelas belas paisagens de Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '6', name: '3ª Night Run Atibaia', type: 'rua', date: '2025-02-09', state: 'SP', city: 'Atibaia', price: 90, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida noturna pelas ruas iluminadas de Atibaia.', location: 'Praça Central - Atibaia', organizer: 'Atibaia Running' },
  { id: '7', name: '4ª Corrida de Rua Monte Azul Paulista', type: 'rua', date: '2025-02-16', state: 'SP', city: 'Monte Azul Paulista', price: 70, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Corrida de rua tradicional de Monte Azul Paulista.', location: 'Centro - Monte Azul Paulista', organizer: 'Monte Azul Runners' },
  { id: '8', name: '4ª Corrida Kids Atibaia', type: 'rua', date: '2025-02-23', state: 'SP', city: 'Atibaia', price: 50, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Mais uma edição da corrida infantil de Atibaia!', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '9', name: '4ª Corrida Pedestre Monte Alegre do Sul', type: 'rua', date: '2025-03-02', state: 'SP', city: 'Monte Alegre do Sul', price: 80, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Quarta edição da corrida pedestre de Monte Alegre do Sul.', location: 'Praça Central - Monte Alegre do Sul', organizer: 'Monte Alegre Runners' },
  { id: '10', name: '4ª Corrida Rústica Brigadeiro Faria Lima', type: 'rua', date: '2025-03-09', state: 'SP', city: 'São Paulo', price: 120, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Quarta edição da corrida rústica na Faria Lima.', location: 'Av. Brigadeiro Faria Lima - São Paulo', organizer: 'SP Running Events' },
  { id: '11', name: '4ª Night Run Atibaia', type: 'rua', date: '2025-03-16', state: 'SP', city: 'Atibaia', price: 90, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida noturna especial em Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '12', name: '5ª Corrida de Rua Monte Azul Paulista', type: 'rua', date: '2025-03-23', state: 'SP', city: 'Monte Azul Paulista', price: 70, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Quinta edição da corrida de Monte Azul Paulista.', location: 'Centro - Monte Azul Paulista', organizer: 'Monte Azul Runners' },
  { id: '13', name: '5ª Corrida Kids Atibaia', type: 'rua', date: '2025-03-30', state: 'SP', city: 'Atibaia', price: 50, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Quinta edição da corrida infantil de Atibaia!', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '14', name: '5ª Corrida Rústica Brigadeiro Faria Lima', type: 'rua', date: '2025-04-06', state: 'SP', city: 'São Paulo', price: 120, originalPrice: 150, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Quinta edição da tradicional corrida rústica na Faria Lima.', location: 'Av. Brigadeiro Faria Lima - São Paulo', organizer: 'SP Running Events' },
  { id: '15', name: '5K Corrida Solidária Itapira', type: 'rua', distance: '5k', date: '2025-04-13', state: 'SP', city: 'Itapira', price: 0, isFree: true, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Corrida solidária de 5km em Itapira. Evento gratuito!', location: 'Centro de Itapira', organizer: 'Itapira Solidária' },
  { id: '16', name: '5K Run Atibaia', type: 'rua', distance: '5k', date: '2025-04-20', state: 'SP', city: 'Atibaia', price: 60, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida de 5km para todos os níveis em Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '17', name: 'Atibaia Night Run', type: 'rua', date: '2025-04-27', state: 'SP', city: 'Atibaia', price: 95, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Corrida noturna especial de Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '18', name: 'Atibaia Trail Run', type: 'trilha', date: '2025-05-04', state: 'SP', city: 'Atibaia', price: 140, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', description: 'Trail run pelas trilhas e montanhas de Atibaia.', location: 'Serra de Atibaia', organizer: 'Atibaia Trail' },
  { id: '19', name: 'Brasil Ride Stage 1 Guaratinguetá-Itirapina', type: 'trilha', date: '2025-05-11', state: 'SP', city: 'Guaratinguetá', price: 250, image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', description: 'Primeira etapa do Brasil Ride, de Guaratinguetá a Itirapina.', location: 'Guaratinguetá - Itirapina', organizer: 'Brasil Ride' },
  { id: '20', name: 'Brasil Ride Stage 2 Itirapina-Atibaia', type: 'trilha', date: '2025-05-18', state: 'SP', city: 'Itirapina', price: 250, image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800', description: 'Segunda etapa do Brasil Ride, de Itirapina a Atibaia.', location: 'Itirapina - Atibaia', organizer: 'Brasil Ride' },
  { id: '21', name: 'C3 Corrida de Rua de Socorro', type: 'rua', date: '2025-05-25', state: 'SP', city: 'Socorro', price: 85, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Corrida de rua na cidade de Socorro.', location: 'Centro de Socorro', organizer: 'Socorro Running' },
  { id: '22', name: 'Circuito de Corridas de Rua de Jaguariúna', type: 'rua', date: '2025-06-01', state: 'SP', city: 'Jaguariúna', price: 100, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Circuito de corridas de rua em Jaguariúna.', location: 'Centro de Jaguariúna', organizer: 'Jaguariúna Runners' },
  { id: '23', name: 'Circuito Paulista de Corridas 1ª Etapa', type: 'rua', date: '2025-06-08', state: 'SP', city: 'São Paulo', price: 150, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Primeira etapa do Circuito Paulista de Corridas 2025.', location: 'Parque Ibirapuera - São Paulo', organizer: 'Circuito Paulista' },
  { id: '24', name: 'Circuito Run Atibaia', type: 'rua', date: '2025-06-15', state: 'SP', city: 'Atibaia', price: 110, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Circuito de corrida pelas ruas de Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '25', name: 'Corrida 10K Amigos do Queijo', type: 'rua', distance: '10k', date: '2025-06-22', state: 'SP', city: 'São Paulo', price: 95, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Corrida temática de 10km com degustação de queijos!', location: 'Parque Villa-Lobos - São Paulo', organizer: 'Amigos do Queijo' },
  { id: '26', name: 'Corrida de Rua 5K de Piracaia', type: 'rua', distance: '5k', date: '2025-06-29', state: 'SP', city: 'Piracaia', price: 60, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Corrida de 5km em Piracaia.', location: 'Centro de Piracaia', organizer: 'Piracaia Runners' },
  { id: '27', name: 'Corrida de Rua de Amparo', type: 'rua', date: '2025-07-06', state: 'SP', city: 'Amparo', price: 75, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Corrida de rua na histórica cidade de Amparo.', location: 'Centro Histórico - Amparo', organizer: 'Amparo Running' },
  { id: '28', name: 'Corrida de Rua de Pedreira', type: 'rua', date: '2025-07-13', state: 'SP', city: 'Pedreira', price: 70, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Corrida de rua em Pedreira, cidade das porcelanas.', location: 'Centro de Pedreira', organizer: 'Pedreira Runners' },
  { id: '29', name: 'Corrida de Rua de Socorro', type: 'rua', date: '2025-07-20', state: 'SP', city: 'Socorro', price: 85, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida de rua em Socorro.', location: 'Centro de Socorro', organizer: 'Socorro Running' },
  { id: '30', name: 'Corrida Kids de Jarinu', type: 'rua', date: '2025-07-27', state: 'SP', city: 'Jarinu', price: 45, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Corrida especial para crianças em Jarinu.', location: 'Centro de Jarinu', organizer: 'Jarinu Kids Run' },
  { id: '31', name: 'Corrida Noturna de Extrema', type: 'rua', date: '2025-08-03', state: 'SP', city: 'Extrema', price: 90, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Corrida noturna na divisa de SP com MG.', location: 'Centro de Extrema', organizer: 'Extrema Night Run' },
  { id: '32', name: 'Corrida Pedestre de Morungaba', type: 'rua', date: '2025-08-10', state: 'SP', city: 'Morungaba', price: 70, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Corrida pedestre tradicional de Morungaba.', location: 'Centro de Morungaba', organizer: 'Morungaba Runners' },
  { id: '33', name: 'Corrida Rústica de Nazaré Paulista', type: 'rua', date: '2025-08-17', state: 'SP', city: 'Nazaré Paulista', price: 80, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Corrida rústica em Nazaré Paulista.', location: 'Centro de Nazaré Paulista', organizer: 'Nazaré Running' },
  { id: '34', name: 'Corrida Rústica de Vargem', type: 'rua', date: '2025-08-24', state: 'SP', city: 'Vargem', price: 75, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida rústica na cidade de Vargem.', location: 'Centro de Vargem', organizer: 'Vargem Runners' },
  { id: '35', name: 'Desafio de Corrida de Pindamonhangaba', type: 'rua', date: '2025-08-31', state: 'SP', city: 'Pindamonhangaba', price: 100, image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800', description: 'Desafio de corrida em Pindamonhangaba.', location: 'Centro de Pindamonhangaba', organizer: 'Pinda Running' },
  { id: '36', name: 'Etapa Bragança Circuito Paulista', type: 'rua', date: '2025-09-07', state: 'SP', city: 'Bragança Paulista', price: 130, image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800', description: 'Etapa de Bragança Paulista do Circuito Paulista.', location: 'Centro de Bragança Paulista', organizer: 'Circuito Paulista' },
  { id: '37', name: 'Meia Maratona de Atibaia', type: 'rua', distance: '21k', date: '2025-09-14', state: 'SP', city: 'Atibaia', price: 180, originalPrice: 220, image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800', description: 'Meia maratona oficial de Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '38', name: 'Night Run Atibaia', type: 'rua', date: '2025-09-21', state: 'SP', city: 'Atibaia', price: 95, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800', description: 'Night run oficial de Atibaia.', location: 'Centro de Atibaia', organizer: 'Atibaia Running' },
  { id: '39', name: 'Night Run de Itatiba', type: 'rua', date: '2025-09-28', state: 'SP', city: 'Itatiba', price: 90, image: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=800', description: 'Corrida noturna em Itatiba.', location: 'Centro de Itatiba', organizer: 'Itatiba Night Run' },
  { id: '40', name: 'Trail Run Atibaia', type: 'trilha', date: '2025-10-05', state: 'SP', city: 'Atibaia', price: 150, image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', description: 'Trail run pelas montanhas de Atibaia.', location: 'Serra de Atibaia', organizer: 'Atibaia Trail' },
  { id: '41', name: 'Trail Run Bragança Paulista', type: 'trilha', date: '2025-10-12', state: 'SP', city: 'Bragança Paulista', price: 140, image: 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=800', description: 'Trail run nas trilhas de Bragança Paulista.', location: 'Serra de Bragança Paulista', organizer: 'Bragança Trail' },
  { id: '42', name: 'Trail Run Circuito Paulista', type: 'trilha', date: '2025-10-19', state: 'SP', city: 'São Paulo', price: 160, image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800', description: 'Etapa de trail run do Circuito Paulista.', location: 'Serra da Cantareira - São Paulo', organizer: 'Circuito Paulista' },
];
