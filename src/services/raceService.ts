import { Race } from '@/lib/races-data';

// 🔴 CONFIGURAÇÃO BLINDADA COM SEUS DADOS
const TABLE_IDENTIFIER = '28308000000011134'; // ID da Tabela oficial
const CREDENTIALS = {
  projectId: "28308000000011085",
  zaid: "50037517394"
};

// ============================================================================
// 1. FUNÇÃO DE INICIALIZAÇÃO (O Coração da Correção)
// ============================================================================
const getCatalyst = () => {
  const w = window as any;
  let cat = w.catalyst;

  // Se o objeto 'catalyst' nem existe no window, o script do index.html falhou
  if (!cat) {
    throw new Error("⛔ SDK do Catalyst não encontrado. Verifique se o AdBlock está bloqueando.");
  }

  // TENTA CORRIGIR O ERRO "DATASTORE UNDEFINED"
  // Se o datastore não estiver pronto, forçamos a inicialização agora.
  if (!cat.datastore) {
    console.warn("⚠️ Catalyst detectado mas sem Data Store. Forçando inicialização manual...");
    
    try {
      if (cat.sdk && typeof cat.sdk.init === 'function') {
        cat.sdk.init(CREDENTIALS);
        // Atualiza a referência global após o init
        cat = w.catalyst; 
      }
    } catch (e) {
      console.error("Erro ao tentar init manual:", e);
    }
  }

  // Fallback de compatibilidade (para versões diferentes do SDK)
  if (!cat.datastore) {
    if (cat.sdk && cat.sdk.datastore) {
       cat.datastore = cat.sdk.datastore;
    }
  }

  // Verificação Final
  if (!cat.datastore) {
    console.error("❌ ERRO FATAL: Catalyst existe mas o banco de dados falhou.", cat);
    throw new Error("Falha crítica: Banco de Dados não inicializado. Recarregue a página.");
  }

  return cat;
};

// ============================================================================
// 2. BUSCAR CORRIDAS (Leitura pelo ID)
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  try {
    const catalyst = getCatalyst();
    const table = catalyst.datastore.table(TABLE_IDENTIFIER);
    
    // Usamos getRows() em vez de ZQL para garantir que o ID da tabela funcione
    const rows = await table.getRows();

    if (!rows || rows.length === 0) return [];

    // Filtramos e mapeamos os dados
    return rows
      .map((row: any) => {
        // O Catalyst pode retornar os dados dentro de uma chave com o nome da tabela ou direto
        const data = row[Object.keys(row)[0]] || row; 
        return mapRowToRace(data);
      })
      .filter((r: Race) => r.approved); // Só retorna as aprovadas

  } catch (error) {
    console.error("Erro ao buscar corridas:", error);
    return [];
  }
};

// ============================================================================
// 3. SALVAR CORRIDA (Escrita pelo ID)
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [RaceService] Iniciando gravação na tabela:", TABLE_IDENTIFIER);

  try {
    const catalyst = getCatalyst();
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
      approved: false, // Sempre pendente
      hasResults: false,
      image: raceData.image || "",
      type: raceData.type || 'rua',
      price: raceData.price || 0,
      location: raceData.location || `${raceData.city}, ${raceData.state}`
    };

    const insertPromise = table.addRow(rowData);
    const result = await insertPromise;
    
    console.log("✅ Sucesso! ID:", result.ROWID);
    return result;

  } catch (error: any) {
    console.error("❌ Erro ao salvar:", error);
    throw error;
  }
};

// Funções Admin
export const updateRaceInDb = async (id: string, data: Partial<Race>) => {
  const catalyst = getCatalyst();
  const table = catalyst.datastore.table(TABLE_IDENTIFIER);
  const updateData = { ROWID: id, ...data };
  return await table.updateRow(updateData);
};

export const deleteRaceFromDb = async (id: string) => {
  const catalyst = getCatalyst();
  const table = catalyst.datastore.table(TABLE_IDENTIFIER);
  return await table.deleteRow(id);
};

// Helper para mapear os dados do banco para o nosso formato
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