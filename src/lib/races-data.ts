import { getRaceImage } from './state-images';

export type RaceType = 'rua' | 'trilha' | 'hibrida' | 'ultramaratona' | 'duathlon' | 'triathlon' | 'virtual';

export interface Coupon {
  code: string;
  discount: number; // percentual de desconto
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
  customImage?: string; // Imagem personalizada enviada pelo organizador
  description: string;
  location: string;
  organizer: string;
  isFree?: boolean;
  link?: string;
  coupons?: Coupon[];
  hasCoupon?: boolean;
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

// Função para extrair nome da corrida do link URL encoded
function extractRaceName(link: string): string {
  try {
    const match = link.match(/&([^&]+)$/);
    if (match) {
      const encoded = match[1];
      // Decodifica caracteres especiais
      return decodeURIComponent(encoded.replace(/%([0-9A-F]{2})/gi, (_, hex) => 
        String.fromCharCode(parseInt(hex, 16))
      ))
        .replace(/%20/g, ' ')
        .replace(/\+/g, ' ');
    }
  } catch (e) {
    // fallback
  }
  return '';
}

// Função para determinar tipo baseado no nome
function determineRaceType(name: string, distance: string): RaceType {
  const nameLower = name.toLowerCase();
  const distLower = distance.toLowerCase();
  
  if (nameLower.includes('virtual')) return 'virtual';
  if (nameLower.includes('trail') || nameLower.includes('trilha')) return 'trilha';
  if (nameLower.includes('ultra') || distLower.includes('42') || distLower.includes('50') || distLower.includes('100')) return 'ultramaratona';
  if (nameLower.includes('duathlon')) return 'duathlon';
  if (nameLower.includes('triathlon')) return 'triathlon';
  if (nameLower.includes('híbrida') || nameLower.includes('hibrida')) return 'hibrida';
  return 'rua';
}

// Função para converter data DD/MM/YYYY para YYYY-MM-DD
function parseDate(dateStr: string): string {
  if (!dateStr) return '2026-01-01';
  const parts = dateStr.split('/');
  if (parts.length >= 2) {
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2] || '2026';
    return `${year}-${month}-${day}`;
  }
  return '2026-01-01';
}

// Função para gerar preço aleatório mas consistente baseado no ID
function generatePrice(id: string, distance: string): number {
  const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const distLower = distance.toLowerCase();
  
  // Preços base por distância
  let basePrice = 80;
  if (distLower.includes('21') || distLower.includes('meia')) basePrice = 150;
  else if (distLower.includes('42') || distLower.includes('maratona')) basePrice = 250;
  else if (distLower.includes('50') || distLower.includes('ultra') || distLower.includes('100')) basePrice = 300;
  else if (distLower.includes('10')) basePrice = 100;
  else if (distLower.includes('5') || distLower.includes('3')) basePrice = 70;
  
  // Variação de ±30%
  const variation = (hash % 60 - 30) / 100;
  return Math.round(basePrice * (1 + variation));
}

// Dados das corridas do CSV
const rawRacesData = `estado,nome,data,cidade,distancias,organizador,link_corrida,link_oficial
AC,,,,,,https://www.corridasbr.com.br/ac/mostracorrida.asp?escolha=52071&1%AA%20Ultra%20Maratona%20de%20Epitaciol%E2ndia,
AC,,12/04/2026,,6km,Instituto Eu Vivo Live,https://www.corridasbr.com.br/ac/mostracorrida.asp?escolha=52834,
AL,,04/01/2026,,5km,Corrida Urbana,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52655&1%AA%20Corrida%20de%20Reis,
AL,,05/01/2026,,5km,Equipe Vencedores por Cristo,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=50921&1%BA%20Circuito%20da%20Lua,
AL,,11/01/2026,,5/3km,Agreste Eventos,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=51845&Engenho%20Life%20Run,
AL,,11/01/2026,,5/2,5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=51824&II%20Corrida%20e%20Caminhada%20Residencial%20GreenPark,
AL,,11/01/2026,,5/2km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=51830&Corrida%20de%20Ver%E3o,
AL,,11/01/2026,,8/5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52133&Corrida%20Moviment%20Fitlife,
AL,,17/01/2026,,10/5km,Paxá Sports,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52491&Circuito%20American%20Run%20%96%20Etapa%20Fogo,
AL,,18/01/2026,,10/6km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52612&Corrida%20Impar%E1veis,
AL,,19/01/2026,,,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52608&3%AA%20Trein%E3o%20da%20Liberdade,
AL,,25/01/2026,,15/10/5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=51617&15k%20das%20Praias,
AL,,25/01/2026,,10/5/2,5km,Associação dos Municípios Alagoanos,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52490&1%AA%20Corrida%20Quem%20Corre%20Ama,
AL,,25/01/2026,,5km,Brabos Running,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=51618&1%BA%20Desafio%20Santa%20L%FAcia%20Adventure,
AL,,25/01/2026,,10/5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52135&1%AA%20Corrida%20Nobre%20Supermercados,
AL,,01/02/2026,,21/14/7km,IAE Sports,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52610&Trail%20Run%20Carvaval,
AL,,01/02/2026,,10/5/3km,Ednaldo Dias,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=51829&Corrida%20Sert%E3o%2040%20Graus,
AL,,08/02/2026,,12/7km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52611&No%20Limite%20Trail%20Run%20-%20Etapa%206,
AL,,08/02/2026,,10/5km,Equipe Desafio 21,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52495&Desafio%2021%20nos%20Povoados%20%20-%20Edi%E7%E3o%20Terra%20Nova,
AL,,22/02/2026,,5/3km,Assessoria Corrida Urbana,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52650&2%AA%20Corrida%20JVN%20Hortifruti,
AL,,01/03/2026,,10/5km,VT Podcast,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52134&1%AA%20Corrida%20VT%20Run,
AL,,01/03/2026,,10/5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52651&Corrida%20do%20Minist%E9rio%20P%FAblico%202026,
AL,,01/03/2026,,10/5km,DK Eventos Esportivos,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52613&DK%20Running,
AL,,08/03/2026,,10/5km,Genival Batista de Freitas,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=49309&6%AA%20Corrida%20em%20Busca%20da%20Sa%FAde,
AL,,22/03/2026,,10/5 Milhas,SNOC Eventos e Apoio Administrativos,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=49984&10%20Milhas%20Alagoas,
AL,,29/03/2026,,10/5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=52658&1%AA%20Corrida%20Excel%EAncia,
AL,,29/03/2026,,10/5km,,https://www.corridasbr.com.br/al/mostracorrida.asp?escolha=45754&II%20Corrida%20Para%20Cristo,
AM,,11/01/2026,,21/10/5km,,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52485&10%AA%20Edi%E7%E3o%20Trail%20Run%20Extreme,
AM,,25/01/2026,,8km,To Goal,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52487&Desafio%20Jungle%20Runners%202026,
AM,,25/01/2026,,,Jaqueline Remigio,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52486&22%AA%20Maratona%20Kids%20-%20Corrida%20de%20Obst%E1culos,
AM,,15/03/2026,,6km,Instituto Eu Vivo Live,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52824,
AM,,26/04/2026,,13/10/5km,Norte Marketing Esportivo,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52935&Circuito%20das%20Esta%E7%F5es%20-%20Outono,
AM,,14/06/2026,,15/10/5km,Norte Marketing Esportivo,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52936&Circuito%20das%20Esta%E7%F5es%20-%20Inverno,
AM,,27/06/2026,,10/5km,Norte Mktg Esportivo,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=53069&Night%20Run%202026,
AM,,23/08/2026,,18/10/5km,Norte Marketing Esportivo,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52937&Circuito%20das%20Esta%E7%F5es%20-%20Primavera,
AM,,24/10/2026,,10/5km,MentedeCorredor,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=47968&III%20Corrida%20Sauim-de-Coleira,
AM,,08/11/2026,,10/5km,Norte Marketing Esportivo,https://www.corridasbr.com.br/am/mostracorrida.asp?escolha=52938&Circuito%20das%20Esta%E7%F5es%20-%20Ver%E3o,
BA,,04/01/2026,,11km,Associação de Esporte e Cultura de Itapé,https://www.corridasbr.com.br/ba/mostracorrida.asp?escolha=50976&Eco%20Run,
BA,,04/01/2026,,5km,Daniel Barros,https://www.corridasbr.com.br/ba/mostracorrida.asp?escolha=50809&Daniel%20Run,
BA,,11/01/2026,,5km,MS Sports,https://www.corridasbr.com.br/ba/mostracorrida.asp?escolha=51752&Corrida%20Arqueol%F3gica,
CE,,10/01/2026,,5/3km,,https://www.corridasbr.com.br/ce/mostracorrida.asp?escolha=51339&1%AA%20Corrida%20Bello%20P%E9,
CE,,10/01/2026,,10/5km,,https://www.corridasbr.com.br/ce/mostracorrida.asp?escolha=52723&1%AA%20Muri%FA%20Run,
CE,,11/01/2026,,5km,Daniela Coelho do Nascimento,https://www.corridasbr.com.br/ce/mostracorrida.asp?escolha=51997&II%20Corridado%20Projeto%20%C1gua,
DF,,04/01/2026,,5km,Conta Passos Produções e Eventos,https://www.corridasbr.com.br/df/mostracorrida.asp?escolha=50996&Corrida%20Number%20%231%202026,
DF,,11/01/2026,,10/5km,,https://www.corridasbr.com.br/df/mostracorrida.asp?escolha=51451&3%AA%20Corrida%20e%20Caminhada%20de%20S%E3o%20Sebasti%E3o,
DF,,18/01/2026,,10/5km,Academia Evolve,https://www.corridasbr.com.br/df/mostracorrida.asp?escolha=51761&Evolve%20Run%20-%20Noroeste,
ES,,04/01/2026,,6km,Premium Comunicação e Marketing,https://www.corridasbr.com.br/es/mostracorrida.asp?escolha=51936&Corrida%20Itapemirim%206k,
ES,,11/01/2026,,8km,Arete Soluções,https://www.corridasbr.com.br/es/mostracorrida.asp?escolha=51932&Corrida%20Rock%20Running%20-%20Obstacle%20Race,
GO,,03/01/2026,,10/5km,,https://www.corridasbr.com.br/go/mostracorrida.asp?escolha=52350&Corrida%20e%20Caminhada%20Centro%20Esp%EDrita%20Auta%20de%20Souza,
GO,,04/01/2026,,10/5km,Roberto Carlos,https://www.corridasbr.com.br/go/mostracorrida.asp?escolha=52359&II%20Corrida%20Tr%EAs%20Ranchos,
MA,,25/01/2026,,10/5km,Pact Produ%E7%F5es,https://www.corridasbr.com.br/ma/mostracorrida.asp?escolha=52636&3%AA%20Corrida%20Pact,
MG,,03/01/2026,,10/5km,,https://www.corridasbr.com.br/mg/mostracorrida.asp?escolha=52301&1%AA%20Corrida%20Atl%E9tica%20Gerais,
MG,,04/01/2026,,21/10/5km,Superando Treinos e Eventos,https://www.corridasbr.com.br/mg/mostracorrida.asp?escolha=50971&Corrida%20Veredas%20Run,
MS,,04/01/2026,,10/5km,,https://www.corridasbr.com.br/ms/mostracorrida.asp?escolha=52352&Corrida%20Bosque%20Santa%20F%E9,
MT,,11/01/2026,,10/5km,CTC Eventos,https://www.corridasbr.com.br/mt/mostracorrida.asp?escolha=51790&6%AA%20Corrida%20da%20Integra%E7%E3o,
PA,,11/01/2026,,6km,,https://www.corridasbr.com.br/pa/mostracorrida.asp?escolha=52353&1%AA%20Corrida%20da%20SEMOB,
PB,,10/01/2026,,5km,Marcos Vinícius,https://www.corridasbr.com.br/pb/mostracorrida.asp?escolha=52566&1%AA%20Corrida%20Solid%E1ria%20de%20Santa%20Rita,
PE,,04/01/2026,,10/5km,,https://www.corridasbr.com.br/pe/mostracorrida.asp?escolha=51682&Corrida%20Bom%20Jesus%20dos%20Navegantes,
PI,,04/01/2026,,10/5km,Taua Sports,https://www.corridasbr.com.br/pi/mostracorrida.asp?escolha=52459&Circuito%20Parnaibano%20-%20Etapa%201,
PR,,04/01/2026,,10/5km,Ativo Sports,https://www.corridasbr.com.br/pr/mostracorrida.asp?escolha=52404&Corrida%20Vida%20Ativa,
RJ,,04/01/2026,,10/5km,Corpo em A%E7%E3o,https://www.corridasbr.com.br/rj/mostracorrida.asp?escolha=52157&Circuito%20Ocean%20-%20Etapa%201,
RN,,04/01/2026,,21/10/5km,Norte Mktg Esportivo,https://www.corridasbr.com.br/rn/mostracorrida.asp?escolha=52901&Circuito%20das%20Esta%E7%F5es%20-%20Ver%E3o,
RO,,25/01/2026,,10/5km,,https://www.corridasbr.com.br/ro/mostracorrida.asp?escolha=52447&Corrida%20do%20G%E1s%20IV,
RR,,08/02/2026,,10/5km,,https://www.corridasbr.com.br/rr/mostracorrida.asp?escolha=52450&Corrida%20Roraima%20-%20Edi%E7%E3o%20Ver%E3o,
RS,,04/01/2026,,10/5km,Rota Eventos,https://www.corridasbr.com.br/rs/mostracorrida.asp?escolha=51456&1%AA%20Corrida%20Solid%E1ria%20Passo%20Fundo,
SC,,04/01/2026,,21/10/5km,Mar de Eventos,https://www.corridasbr.com.br/sc/mostracorrida.asp?escolha=52391&Meia%20Maratona%20de%20Florian%F3polis,
SE,,11/01/2026,,10/5km,Ativa Esportes,https://www.corridasbr.com.br/se/mostracorrida.asp?escolha=52540&Corrida%20de%20S%E3o%20Sebasti%E3o,
SP,,04/01/2026,,10/5km,SP Running,https://www.corridasbr.com.br/sp/mostracorrida.asp?escolha=52180&1%AA%20Corrida%20do%20Ano%20Novo,
SP,,04/01/2026,,21/10/5km,Yescom,https://www.corridasbr.com.br/sp/mostracorrida.asp?escolha=45030&19%AA%20Meia%20Maratona%20de%20S%E3o%20Paulo,
SP,,11/01/2026,,42/21/10/5km,Corpore,https://www.corridasbr.com.br/sp/mostracorrida.asp?escolha=52341&Maratona%20de%20S%E3o%20Paulo%202026,
SP,,18/01/2026,,10/5km,Track%26Field,https://www.corridasbr.com.br/sp/mostracorrida.asp?escolha=52282&Santander%20Track%26Fields%20Run%20Series,
SP,,25/01/2026,,21/10/5km,Endorfina Esportes,https://www.corridasbr.com.br/sp/mostracorrida.asp?escolha=45166&3%AA%20Meia%20Maratona%20do%20Butant%E3,
TO,,08/03/2026,,7km,,https://www.corridasbr.com.br/to/mostracorrida.asp?escolha=51198&II%20Corrida%20e%20Caminhada%20da%20Mulher,
TO,,26/04/2026,,6km,Instituto Eu Vivo Esporte,https://www.corridasbr.com.br/to/mostracorrida.asp?escolha=52837,
TO,,05/07/2026,,8/4km,TF Sports,https://www.corridasbr.com.br/to/mostracorrida.asp?escolha=52780&Santander%20Track%26Fields%20Run%20Series,
TO,,22/08/2026,,10/5km,Norte Marketing Esportivo,https://www.corridasbr.com.br/to/mostracorrida.asp?escolha=53077&Night%20Run%202026`;

// Parse do CSV para gerar corridas
function parseCSVToRaces(): Race[] {
  const lines = rawRacesData.split('\n').slice(1); // Pula header
  const races: Race[] = [];
  let idCounter = 1;
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const parts = line.split(',');
    const state = parts[0]?.trim() || 'SP';
    const name = parts[1]?.trim() || '';
    const dateStr = parts[2]?.trim() || '';
    const city = parts[3]?.trim() || citiesByState[state]?.[0] || 'Capital';
    const distance = parts[4]?.trim() || '';
    const organizer = parts[5]?.trim() || 'Organizador Local';
    const link = parts[6]?.trim() || '';
    
    // Extrai nome do link se não tiver nome
    const finalName = name || extractRaceName(link) || `Corrida ${state} ${idCounter}`;
    
    const id = `race-${idCounter}`;
    const type = determineRaceType(finalName, distance);
    const date = parseDate(dateStr);
    const price = generatePrice(id, distance);
    
    // Alguns eventos têm cupom (aleatório mas consistente)
    const hash = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hasCoupon = hash % 5 === 0; // ~20% das corridas têm cupom
    
    const race: Race = {
      id,
      name: finalName,
      type,
      distance: distance || undefined,
      date,
      state,
      city: city || citiesByState[state]?.[0] || 'Capital',
      price,
      originalPrice: hasCoupon ? Math.round(price * 1.2) : undefined,
      image: getRaceImage(state, id),
      description: `${finalName} - ${stateNames[state] || state}. Evento de corrida para todos os níveis.`,
      location: city || citiesByState[state]?.[0] || 'Capital',
      organizer,
      link: link || undefined,
      hasCoupon,
      coupons: hasCoupon ? [
        {
          code: `TRIBO${hash % 100}`,
          discount: [10, 15, 20][hash % 3],
          description: `Desconto exclusivo Tribo da Corrida!`
        }
      ] : undefined,
    };
    
    races.push(race);
    idCounter++;
  }
  
  return races;
}

export const mockRaces: Race[] = parseCSVToRaces();

// Corridas com cupom para destaque
export const racesWithCoupons = mockRaces.filter(race => race.hasCoupon);

// Corridas gratuitas
export const freeRaces = mockRaces.filter(race => race.isFree);

// Próximas corridas (ordenadas por data)
export const upcomingRaces = [...mockRaces]
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .filter(race => new Date(race.date) >= new Date());
