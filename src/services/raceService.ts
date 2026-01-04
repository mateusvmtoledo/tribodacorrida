import { initCatalyst, getTable } from '@/lib/catalyst';
import { Race } from '@/lib/races-data';

const TABLE_NAME = 'Corridas';

// Mapeia do Banco (Zoho) para o Site
// Adicionei o campo 'approved' no mapeamento
const mapFromDb = (row: any): Race => ({
  id: row.ROWID, 
  name: row.name,
  type: 'rua', // Se tiver coluna type no banco, mude para row.type
  distance: row.distance,
  date: row.dateRun,
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
  // Usamos um cast boolean simples caso venha como string/null
  approved: row.approved === true || row.approved === 'true', 
  originalPrice: undefined,
  hasCoupon: false
});

export const fetchRacesFromDb = async (): Promise<Race[]> => {
  try {
    initCatalyst();
    const table = getTable(TABLE_NAME);
    if (!table) return [];

    const rows = await table.getAllRows();
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

    const rowData = {
      name: raceData.name,
      dateRun: raceData.date,
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
      approved: false, // <--- Cria como pendente por padrão
      email: raceData.email || ''
    };

    const insertedRow = await table.insertRow(rowData);
    return mapFromDb(insertedRow);
  } catch (error) {
    console.error("Erro ao inserir no Catalyst:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Atualizar Corrida (Aprovar, Editar Links, etc)
export const updateRaceInDb = async (id: string, updates: Partial<Race>) => {
  try {
    initCatalyst();
    const table = getTable(TABLE_NAME);
    if (!table) throw new Error("Erro conexão tabela");

    // Mapear campos do frontend para as colunas do banco
    const rowData: any = {
      ROWID: id, // Obrigatório para o update
    };

    if (updates.name) rowData.name = updates.name;
    if (updates.date) rowData.dateRun = updates.date;
    if (updates.hasResults !== undefined) rowData.has_results = updates.hasResults;
    if (updates.photosLink !== undefined) rowData.photos_link = updates.photosLink;
    if (updates.approved !== undefined) rowData.approved = updates.approved;
    // Adicione outros campos se quiser permitir editar tudo

    const updatedRow = await table.updateRow(rowData);
    return mapFromDb(updatedRow);
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    throw error;
  }
};

// NOVA FUNÇÃO: Deletar Corrida
export const deleteRaceFromDb = async (id: string) => {
  try {
    initCatalyst();
    const table = getTable(TABLE_NAME);
    if (!table) throw new Error("Erro conexão tabela");

    await table.deleteRow(id);
    return true;
  } catch (error) {
    console.error("Erro ao deletar:", error);
    throw error;
  }
};