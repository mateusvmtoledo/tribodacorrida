// Dados dos parceiros/patrocinadores
export interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  description?: string;
  category: 'nutrition' | 'sports' | 'health' | 'technology' | 'retail' | 'other';
}

// 12 banners de parceiros (placeholder - substituir por logos reais)
export const partners: Partner[] = [
  {
    id: 'partner-1',
    name: 'Energy Gel Pro',
    logo: 'https://images.unsplash.com/photo-1594882645126-14020914d58d?w=400&h=200&fit=crop',
    url: '#',
    description: 'Suplementos para atletas de alta performance',
    category: 'nutrition',
  },
  {
    id: 'partner-2',
    name: 'Run Shoes Max',
    logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=200&fit=crop',
    url: '#',
    description: 'Tênis de corrida com tecnologia avançada',
    category: 'sports',
  },
  {
    id: 'partner-3',
    name: 'Hidrata+',
    logo: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=200&fit=crop',
    url: '#',
    description: 'Hidratação e isotônicos para atletas',
    category: 'nutrition',
  },
  {
    id: 'partner-4',
    name: 'FitWatch Tech',
    logo: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400&h=200&fit=crop',
    url: '#',
    description: 'Relógios e monitores esportivos',
    category: 'technology',
  },
  {
    id: 'partner-5',
    name: 'PhysioRun',
    logo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    url: '#',
    description: 'Fisioterapia especializada em corredores',
    category: 'health',
  },
  {
    id: 'partner-6',
    name: 'SportWear Plus',
    logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=200&fit=crop',
    url: '#',
    description: 'Roupas e acessórios esportivos',
    category: 'retail',
  },
  {
    id: 'partner-7',
    name: 'Natural Protein',
    logo: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=200&fit=crop',
    url: '#',
    description: 'Proteínas e suplementos naturais',
    category: 'nutrition',
  },
  {
    id: 'partner-8',
    name: 'TrackApp GPS',
    logo: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=200&fit=crop',
    url: '#',
    description: 'Aplicativo de rastreamento para corridas',
    category: 'technology',
  },
  {
    id: 'partner-9',
    name: 'Runner\'s Club',
    logo: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=200&fit=crop',
    url: '#',
    description: 'Comunidade de corredores',
    category: 'other',
  },
  {
    id: 'partner-10',
    name: 'Ortho Sports',
    logo: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=200&fit=crop',
    url: '#',
    description: 'Palmilhas e produtos ortopédicos',
    category: 'health',
  },
  {
    id: 'partner-11',
    name: 'Vita Energy',
    logo: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=400&h=200&fit=crop',
    url: '#',
    description: 'Vitaminas e minerais para atletas',
    category: 'nutrition',
  },
  {
    id: 'partner-12',
    name: 'Mega Sports Store',
    logo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=200&fit=crop',
    url: '#',
    description: 'Loja completa de artigos esportivos',
    category: 'retail',
  },
];
