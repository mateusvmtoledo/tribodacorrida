import { getRaceImage } from './state-images';
import racesCSV from '@/data/corridas_brasil_2026.csv?raw';

export type RaceType = 'rua' | 'trilha' | 'hibrida' | 'ultramaratona' | 'duathlon' | 'triathlon' | 'virtual';

export interface Coupon {
  code: string;
  discount: number;
  description?: string;
}

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
  customImage?: string;
  description: string;
  location: string;
  organizer: string;
  isFree?: boolean;
  link?: string;
  coupons?: Coupon[];
  hasCoupon?: boolean;
  // Novos campos para Resultados
  photosLink?: string;
  hasResults?: boolean; // Controle do Admin
}

export const raceTypes: { value: RaceType; label: string }[] = [
  { value: 'rua', label: 'Corrida de Rua' },
  { value: 'trilha', label: 'Corrida de Trilha' },
  { value: 'hibrida', label: 'Corrida Híbrida' },
  { value: 'ultramaratona', label: 'Ultramaratona' },
  { value: 'duathlon', label: 'Duathlon' },
  { value: 'triathlon', label: 'Triathlon' },
  { value: 'virtual', label: 'Corrida Virtual' },
];

export const distances = [
  { value: '3k', label: '3 km' },
  { value: '5k', label: '5 km' },
  { value: '10k', label: '10 km' },
  { value: '15k', label: '15 km' },
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

export const stateNames: Record<string, string> = {
  AC: 'Acre',
  AL: 'Alagoas',
  AP: 'Amapá',
  AM: 'Amazonas',
  BA: 'Bahia',
  CE: 'Ceará',
  DF: 'Distrito Federal',
  ES: 'Espírito Santo',
  GO: 'Goiás',
  MA: 'Maranhão',
  MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais',
  PA: 'Pará',
  PB: 'Paraíba',
  PR: 'Paraná',
  PE: 'Pernambuco',
  PI: 'Piauí',
  RJ: 'Rio de Janeiro',
  RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul',
  RO: 'Rondônia',
  RR: 'Roraima',
  SC: 'Santa Catarina',
  SP: 'São Paulo',
  SE: 'Sergipe',
  TO: 'Tocantins',
};

export const citiesByState: Record<string, string[]> = {
  AC: ['Rio Branco', 'Cruzeiro do Sul', 'Epitaciolândia'],
  AL: ['Maceió', 'Arapiraca', 'Palmeira dos Índios'],
  AP: ['Macapá', 'Santana', 'Laranjal do Jari'],
  AM: ['Manaus', 'Parintins', 'Itacoatiara'],
  BA: ['Salvador', 'Porto Seguro', 'Ilhéus', 'Feira de Santana', 'Vitória da Conquista'],
  CE: ['Fortaleza', 'Jericoacoara', 'Juazeiro do Norte', 'Sobral', 'Guaramiranga'],
  DF: ['Brasília', 'Taguatinga', 'Ceilândia'],
  ES: ['Vitória', 'Vila Velha', 'Serra', 'Guarapari', 'Cachoeiro de Itapemirim'],
  GO: ['Goiânia', 'Anápolis', 'Rio Verde', 'Caldas Novas'],
  MA: ['São Luís', 'Imperatriz', 'Caxias'],
  MT: ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
  MS: ['Campo Grande', 'Dourados', 'Bonito', 'Corumbá'],
  MG: ['Belo Horizonte', 'Ouro Preto', 'Uberlândia', 'Juiz de Fora', 'Tiradentes'],
  PA: ['Belém', 'Santarém', 'Marabá', 'Altamira'],
  PB: ['João Pessoa', 'Campina Grande', 'Cabedelo'],
  PR: ['Curitiba', 'Foz do Iguaçu', 'Londrina', 'Maringá', 'Ponta Grossa'],
  PE: ['Recife', 'Olinda', 'Porto de Galinhas', 'Caruaru'],
  PI: ['Teresina', 'Parnaíba', 'Picos'],
  RJ: ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Búzios', 'Paraty', 'Angra dos Reis'],
  RN: ['Natal', 'Mossoró', 'Pipa'],
  RS: ['Porto Alegre', 'Gramado', 'Canela', 'Caxias do Sul', 'Pelotas'],
  RO: ['Porto Velho', 'Ji-Paraná', 'Ariquemes'],
  RR: ['Boa Vista', 'Pacaraima'],
  SC: ['Florianópolis', 'Blumenau', 'Joinville', 'Balneário Camboriú', 'Chapecó'],
  SP: ['São Paulo', 'Campinas', 'Santos', 'Guarulhos', 'Ribeirão Preto', 'Atibaia', 'Sorocaba', 'Bauru'],
  SE: ['Aracaju', 'Nossa Senhora do Socorro'],
  TO: ['Palmas', 'Araguaína', 'Gurupi'],
};

function decodeUrlString(str: string): string {
  try {
    let decoded = str.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => 
      String.fromCharCode(parseInt(hex, 16))
    );
    decoded = decoded
      .replace(/ã/g, 'ã').replace(/á/g, 'á').replace(/â/g, 'â').replace(/à/g, 'à')
      .replace(/é/g, 'é').replace(/ê/g, 'ê').replace(/í/g, 'í').replace(/ó/g, 'ó')
      .replace(/ô/g, 'ô').replace(/ú/g, 'ú').replace(/ç/g, 'ç').replace(/ñ/g, 'ñ')
      .replace(/Ã£/g, 'ã').replace(/Ã¡/g, 'á').replace(/Ã¢/g, 'â')
      .replace(/Ã©/g, 'é').replace(/Ãª/g, 'ê').replace(/Ã­/g, 'í')
      .replace(/Ã³/g, 'ó').replace(/Ã´/g, 'ô').replace(/Ãº/g, 'ú')
      .replace(/Ã§/g, 'ç').replace(/Ã±/g, 'ñ')
      .replace(/\+/g, ' ')
      .replace(/%20/g, ' ');
    return decoded;
  } catch {
    return str;
  }
}

function extractRaceName(link: string): string {
  if (!link) return '';
  try {
    const match = link.match(/&([^&]+)$/);
    if (match) {
      return decodeUrlString(match[1]);
    }
    const escolhaMatch = link.match(/escolha=(\d+)/);
    if (escolhaMatch) {
      return `Corrida ${escolhaMatch[1]}`;
    }
  } catch {
  }
  return '';
}

function determineRaceType(name: string, distance: string): RaceType {
  const nameLower = name.toLowerCase();
  const distLower = distance.toLowerCase();
  
  if (nameLower.includes('virtual')) return 'virtual';
  if (nameLower.includes('trail') || nameLower.includes('trilha') || nameLower.includes('eco run')) return 'trilha';
  if (nameLower.includes('ultra') || distLower.includes('50') || distLower.includes('100') || distLower.includes('45')) return 'ultramaratona';
  if (nameLower.includes('duathlon') || nameLower.includes('duatlo')) return 'duathlon';
  if (nameLower.includes('triathlon') || nameLower.includes('triatlo')) return 'triathlon';
  if (nameLower.includes('híbrida') || nameLower.includes('hibrida')) return 'hibrida';
  
  const distNum = parseInt(distance);
  if (distNum >= 42) return 'ultramaratona';
  
  return 'rua';
}

function parseDate(dateStr: string): string {
  if (!dateStr || dateStr.trim() === '') return '2026-01-01';
  
  const parts = dateStr.split('/');
  if (parts.length >= 2) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts.length >= 3 ? parts[2] : '2026';
    return `${year}-${month}-${day}`;
  }
  return '2026-01-01';
}

function generatePrice(seed: string, distance: string): number {
  const hash = seed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const distLower = distance.toLowerCase();
  
  let basePrice = 80;
  if (distLower.includes('21') || distLower.includes('meia')) basePrice = 150;
  else if (distLower.includes('42') || distLower.includes('maratona')) basePrice = 250;
  else if (distLower.includes('50') || distLower.includes('ultra') || distLower.includes('100')) basePrice = 300;
  else if (distLower.includes('10')) basePrice = 100;
  else if (distLower.includes('5') || distLower.includes('3')) basePrice = 70;
  else if (distLower.includes('45') || distLower.includes('35')) basePrice = 280;
  
  const variation = (hash % 60 - 30) / 100;
  return Math.round(basePrice * (1 + variation));
}

function generateDescription(name: string, type: RaceType, city: string, state: string): string {
  const typeDescriptions: Record<RaceType, string[]> = {
    rua: [
      `Corrida de rua tradicional em ${city}, ${stateNames[state] || state}. Venha participar deste evento incrível!`,
      `Evento de corrida urbana com percurso emocionante pelas ruas de ${city}.`,
      `Corrida de rua com estrutura completa e premiação. Inscreva-se já!`,
    ],
    trilha: [
      `Trail run desafiador em meio à natureza exuberante de ${stateNames[state] || state}.`,
      `Corrida de trilha com paisagens incríveis e desafios emocionantes.`,
      `Aventure-se nas trilhas de ${city} neste evento imperdível!`,
    ],
    ultramaratona: [
      `Ultramaratona desafiadora para atletas de elite. Supere seus limites!`,
      `Prova de resistência extrema com suporte completo ao atleta.`,
      `Ultra desafio em ${stateNames[state] || state}. Você está preparado?`,
    ],
    hibrida: [
      `Corrida híbrida combinando asfalto e trilha. O melhor dos dois mundos!`,
      `Evento misto com trechos urbanos e off-road em ${city}.`,
    ],
    duathlon: [
      `Duathlon com corrida e ciclismo. Teste sua versatilidade!`,
      `Competição multiesportiva em ${city}. Venha participar!`,
    ],
    triathlon: [
      `Triathlon completo com natação, ciclismo e corrida.`,
      `O maior desafio esportivo te espera em ${stateNames[state] || state}!`,
    ],
    virtual: [
      `Corrida virtual - corra onde você estiver e envie seu tempo!`,
      `Participe de casa ou do seu local favorito nesta corrida virtual.`,
    ],
  };
  
  const descriptions = typeDescriptions[type] || typeDescriptions.rua;
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return descriptions[hash % descriptions.length];
}

function parseCSVToRaces(): Race[] {
  const lines = racesCSV.split('\n').slice(1); 
  const races: Race[] = [];
  let idCounter = 1;
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());
    
    const state = parts[0]?.trim().toUpperCase() || 'SP';
    if (!states.includes(state)) continue;
    
    const csvName = parts[1]?.trim() || '';
    const dateStr = parts[2]?.trim() || '';
    const city = parts[3]?.trim() || citiesByState[state]?.[0] || 'Capital';
    const distance = parts[4]?.trim() || '';
    const organizer = parts[5]?.trim() || 'Organizador Local';
    const link = parts[6]?.trim() || '';
    
    const finalName = csvName || extractRaceName(link) || `Corrida ${state} #${idCounter}`;
    
    if (finalName.length < 3) continue;
    
    const id = `race-${state.toLowerCase()}-${idCounter}`;
    const type = determineRaceType(finalName, distance);
    const date = parseDate(dateStr);
    const price = generatePrice(id + finalName, distance);
    
    const hash = (id + finalName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hasCoupon = hash % 7 === 0;
    const isFree = hash % 33 === 0;
    
    // Simulação para o "hasResults" e "photosLink"
    // Vamos supor que 90% das provas têm resultados
    const hasResults = hash % 10 !== 0; 
    // Vamos supor que 30% das provas têm fotos no Fotop (mock)
    const hasPhotos = hash % 3 === 0;

    const race: Race = {
      id,
      name: finalName,
      type,
      distance: distance || undefined,
      date,
      state,
      city: city || citiesByState[state]?.[0] || 'Capital',
      price: isFree ? 0 : price,
      originalPrice: hasCoupon ? Math.round(price * 1.25) : undefined,
      image: getRaceImage(state, id),
      description: generateDescription(finalName, type, city, state),
      location: `${city}, ${stateNames[state] || state}`,
      organizer: organizer || 'Organizador Local',
      isFree,
      link: link || undefined,
      hasCoupon,
      coupons: hasCoupon ? [{
        code: `TRIBO${hash % 100}`,
        discount: 10 + (hash % 20),
        description: `Desconto especial Tribo da Corrida`
      }] : undefined,
      // Novos campos preenchidos
      hasResults: hasResults,
      photosLink: hasPhotos ? 'https://fotop.com.br' : undefined,
    };
    
    races.push(race);
    idCounter++;
  }
  
  return races;
}

export const mockRaces: Race[] = parseCSVToRaces();
export const racesWithCoupons = mockRaces.filter(race => race.hasCoupon);
export const freeRaces = mockRaces.filter(race => race.isFree);

export const upcomingRaces = [...mockRaces]
  .filter(race => new Date(race.date) >= new Date())
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

export const racesByState = mockRaces.reduce((acc, race) => {
  if (!acc[race.state]) acc[race.state] = [];
  acc[race.state].push(race);
  return acc;
}, {} as Record<string, Race[]>);

export const raceStats = {
  total: mockRaces.length,
  byType: mockRaces.reduce((acc, race) => {
    acc[race.type] = (acc[race.type] || 0) + 1;
    return acc;
  }, {} as Record<RaceType, number>),
  byState: Object.keys(racesByState).reduce((acc, state) => {
    acc[state] = racesByState[state].length;
    return acc;
  }, {} as Record<string, number>),
  withCoupons: racesWithCoupons.length,
  free: freeRaces.length,
};

export const pastRaces = mockRaces
  .filter(race => {
    const raceDate = new Date(race.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    return raceDate < today;
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

console.log(`✅ Carregadas ${mockRaces.length} corridas de 2026`);