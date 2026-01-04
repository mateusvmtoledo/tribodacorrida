import { initCatalyst, getTable } from '@/lib/catalyst';
import { Race } from '@/lib/races-data';

const TABLE_NAME = 'Corridas';

// Mapeia do Banco (Zoho) para o Site
const mapFromDb = (row: any): Race => ({
  id: row.ROWID, 
  name: row.name,
  type: 'rua',
  distance: row.distance,
  date: row.dateRun, // <--- Importante: Coluna dateRun
  state: row.state,
  city: row.city,
  price: row.price ? parseFloat(row.price) : 0,
  image: row.image || 'https://images.unsplash.com/photo-1552674605-5d28c4a11843?q=80',
  description: row.description || '', 
  location: `${row.city}, ${row.state}`,
  organizer: row.organizer,
  isFree: row.is_free || false,
  link: row.link,
  hasResults: row.has_results || false,
  photosLink: row.photos_link || '',
  originalPrice: undefined,
  hasCoupon: false
});

export const fetchRacesFromDb = async (): Promise<Race[]> => {
  try {
    initCatalyst();
    const table = getTable(TABLE_NAME);
    if (!table) return [];

    // O Web SDK retorna os dados dentro de uma Promise
    const rows = await table.getAllRows();
    
    // Tratamento de segurança para o formato de retorno
    const data = Array.isArray(rows) ? rows : (rows as any).content || [];
    
    return data.map(mapFromDb);
  } catch (error) {
    console.error("Erro ao buscar no Catalyst:", error);
    return [];
  }
};

export const createRaceInDb = async (raceData: Partial<Race>) => {
  try {
    initCatalyst();
    const table = getTable(TABLE_NAME);
    if (!table) throw new Error("Falha ao conectar no Data Store");

    // Objeto EXATO conforme seu schema
    const rowData = {
      name: raceData.name,
      dateRun: raceData.date, // Frontend: date -> Banco: dateRun
      city: raceData.city,
      state: raceData.state,
      distance: raceData.distance,
      organizer: raceData.organizer,
      link: raceData.link,
      description: raceData.description,
      is_free: raceData.isFree || false,
      price: raceData.price || 0,
      image: raceData.image,
      has_results: false,
      photos_link: '',
      email: ''
    };

    const insertedRow = await table.insertRow(rowData);
    return mapFromDb(insertedRow);
  } catch (error) {
    console.error("Erro ao inserir no Catalyst:", error);
    throw error;
  }
};