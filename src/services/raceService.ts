import { Race } from '@/lib/races-data';

// 🔴 CONFIGURAÇÃO BLINDADA COM SEUS DADOS
const TABLE_IDENTIFIER = '28308000000011134';
const CREDENTIALS = {
  projectId: "28308000000011085",
  zaid: "50037517394"
};

// ============================================================================
// 1. INICIALIZAÇÃO FORÇADA DO CATALYST
// ============================================================================
let isInitialized = false;

const initializeCatalyst = async () => {
  if (isInitialized) return;

  const w = window as any;
  
  if (!w.catalyst) {
    throw new Error("⛔ SDK do Catalyst não encontrado no window");
  }

  try {
    // FORÇA A INICIALIZAÇÃO EXPLÍCITA
    if (typeof w.catalyst.auth?.init === 'function') {
      await w.catalyst.auth.init(CREDENTIALS);
      console.log("✅ Catalyst Auth inicializado");
    }

    // Aguarda um momento para o datastore ficar disponível
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!w.catalyst.datastore) {
      throw new Error("❌ Datastore ainda não disponível após init");
    }

    isInitialized = true;
    console.log("✅ Catalyst Datastore pronto!");
    
  } catch (error) {
    console.error("❌ Erro na inicialização:", error);
    throw error;
  }
};

const getCatalyst = async () => {
  await initializeCatalyst();
  
  const w = window as any;
  if (!w.catalyst?.datastore) {
    throw new Error("Banco de dados não inicializado. Recarregue a página.");
  }
  
  return w.catalyst;
};

// ============================================================================
// 2. BUSCAR CORRIDAS
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  try {
    const catalyst = await getCatalyst();
    const table = catalyst.datastore.table(TABLE_IDENTIFIER);
    
    const rows = await table.getRows();

    if (!rows || rows.length === 0) return [];

    return rows
      .map((row: any) => {
        const data = row[Object.keys(row)[0]] || row; 
        return mapRowToRace(data);
      })
      .filter((r: Race) => r.approved);

  } catch (error) {
    console.error("❌ Erro ao buscar corridas:", error);
    return [];
  }
};

// ============================================================================
// 3. SALVAR CORRIDA (COM INICIALIZAÇÃO GARANTIDA)
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [RaceService] Iniciando gravação na tabela:", TABLE_IDENTIFIER);

  try {
    // GARANTE QUE O CATALYST ESTÁ INICIALIZADO
    const catalyst = await getCatalyst();
    const table = catalyst.datastore.table(TABLE_IDENTIFIER);

    const rowData = {
      name: raceData.name,
      date: raceData.date,
      city: raceData.city,
      state: raceData.state,
      distances: raceData.distances,
      organizer: raceData.organizer || "Não informado",
      email: raceData.email || "",
      description: raceData.description || "",
      link: raceData.link,
      approved: false,
      hasResults: false,
      image: raceData.image || "",
      type: raceData.type || 'rua',
      price: raceData.price || 0,
      location: raceData.location || `${raceData.city}, ${raceData.state}`
    };

    console.log("📤 Dados preparados:", rowData);
    
    const result = await table.addRow(rowData);
    
    console.log("✅ Sucesso! ID:", result.ROWID);
    return result;

  } catch (error: any) {
    console.error("❌ Erro ao salvar:", error);
    throw error;
  }
};

// ============================================================================
// 4. FUNÇÕES ADMIN
// ============================================================================
export const updateRaceInDb = async (id: string, data: Partial<Race>) => {
  const catalyst = await getCatalyst();
  const table = catalyst.datastore.table(TABLE_IDENTIFIER);
  const updateData = { ROWID: id, ...data };
  return await table.updateRow(updateData);
};

export const deleteRaceFromDb = async (id: string) => {
  const catalyst = await getCatalyst();
  const table = catalyst.datastore.table(TABLE_IDENTIFIER);
  return await table.deleteRow(id);
};

// ============================================================================
// 5. HELPER DE MAPEAMENTO
// ============================================================================
function mapRowToRace(data: any): Race {
  return {
    id: data.ROWID,
    name: data.name,
    date: data.date,
    city: data.city,
    state: data.state,
    distances: data.distances || "",
    image: data.image || "",
    link: data.link,
    approved: data.approved,
    organizer: data.organizer,
    description: data.description,
    email: data.email,
    hasResults: data.hasResults || false,
    type: data.type || 'rua',
    price: data.price || 0,
    location: data.location || `${data.city}, ${data.state}`
  };
}