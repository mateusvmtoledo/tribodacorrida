import { Race } from '@/lib/races-data';

// 🔴 CONFIGURAÇÃO BLINDADA COM SEUS DADOS
const TABLE_IDENTIFIER = '28308000000011134';
const CREDENTIALS = {
  projectId: "28308000000011085",
  zaid: "50037517394"
};

// ============================================================================
// 1. INICIALIZAR O CATALYST (SDK NOVO - OBRIGATÓRIO!)
// ============================================================================
let isInitialized = false;

const initCatalyst = async () => {
  if (isInitialized) {
    console.log("✅ [Init] Catalyst já inicializado, pulando...");
    return;
  }

  console.log("🚀 [Init] ========================================");
  console.log("🚀 [Init] Inicializando Catalyst SDK...");

  const w = window as any;
  
  if (!w.catalyst) {
    console.error("❌ [Init] SDK não encontrado no window!");
    throw new Error("SDK do Catalyst não carregado. Verifique o index.html");
  }

  console.log("✅ [Init] SDK encontrado no window");

  try {
    // AQUI ESTÁ A CORREÇÃO: Passamos as credenciais para o init()
    // O erro "CatalystApp not initialized" acontece se chamarmos init() vazio
    console.log("🔧 [Init] Chamando catalyst.init() com credenciais...");
    
    await w.catalyst.init(CREDENTIALS);
    
    console.log("✅ [Init] catalyst.init() executado com sucesso!");
    
    // Aguarda um pouco para garantir que a conexão firmou
    await new Promise(resolve => setTimeout(resolve, 500));
    
    isInitialized = true;
    console.log("✅ [Init] Catalyst completamente inicializado!");
    console.log("🚀 [Init] ========================================");
    
  } catch (error) {
    console.error("❌ [Init] Erro ao inicializar:", error);
    // Se der erro, pode ser que já tenha inicializado pelo index.html, então tentamos seguir
    isInitialized = true; 
  }
};

// ============================================================================
// 2. OBTER TABELA (SDK NOVO)
// ============================================================================
const getTable = async () => {
  console.log("📋 [Table] ========================================");
  console.log("📋 [Table] Obtendo tabela:", TABLE_IDENTIFIER);

  // GARANTE QUE O CATALYST ESTÁ INICIALIZADO
  await initCatalyst();

  const w = window as any;
  
  // No SDK Novo, usamos w.catalyst.table() direto (ou datastore.table)
  // Verificamos qual está disponível
  let tableInstance;

  try {
      if (typeof w.catalyst.table === 'function') {
           console.log("🔧 [Table] Usando w.catalyst.table()...");
           tableInstance = w.catalyst.table(TABLE_IDENTIFIER);
      } else if (w.catalyst.datastore && typeof w.catalyst.datastore.table === 'function') {
           console.log("🔧 [Table] Usando w.catalyst.datastore.table()...");
           tableInstance = w.catalyst.datastore.table(TABLE_IDENTIFIER);
      } else {
           throw new Error("Método .table() não encontrado no SDK");
      }

    console.log("✅ [Table] Tabela obtida com sucesso");
    console.log("📋 [Table] ========================================");
    
    return tableInstance;
    
  } catch (error) {
    console.error("❌ [Table] Erro ao obter tabela:", error);
    throw error;
  }
};

// ============================================================================
// 3. BUSCAR CORRIDAS
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  console.log("📥 [Fetch] ========================================");
  console.log("📥 [Fetch] Iniciando busca de corridas...");
  
  try {
    const table = await getTable();
    
    console.log("📊 [Fetch] Chamando table.getRows()...");
    const result = await table.getRows();
    
    console.log("✅ [Fetch] Resposta recebida (Raw):", result);
    
    // Tratamento para garantir que pegamos o array certo (data ou content)
    const rows = Array.isArray(result) ? result : (result.data || result.content || []);
    console.log(`✅ [Fetch] ${rows.length} linhas processadas`);
    
    if (rows.length === 0) {
      console.warn("⚠️ [Fetch] Nenhuma linha encontrada");
      return [];
    }

    const races = rows
      .map((row: any) => mapRowToRace(row))
      .filter((r: Race) => r.approved);

    console.log(`✅ [Fetch] ${races.length} corridas aprovadas retornadas`);
    console.log("📥 [Fetch] ========================================");
    
    return races;

  } catch (error) {
    console.error("❌ [Fetch] Erro:", error);
    console.log("📥 [Fetch] ========================================");
    return [];
  }
};

// ============================================================================
// 4. SALVAR CORRIDA (COM INICIALIZAÇÃO GARANTIDA)
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [Save] ========================================");
  console.log("💾 [Save] Iniciando gravação...");
  console.log("💾 [Save] Tabela:", TABLE_IDENTIFIER);

  try {
    // 1. Obter tabela (já faz o init automaticamente)
    console.log("📋 [Save] Etapa 1: Obtendo tabela...");
    const table = await getTable();

    // 2. Preparar dados
    console.log("📦 [Save] Etapa 2: Preparando rowData...");
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

    console.log("✅ [Save] rowData preparado:", rowData);

    // 3. Inserir (No SDK novo usamos insertRow)
    console.log("📤 [Save] Etapa 3: Chamando table.insertRow()...");
    
    // Nota: insertRow geralmente retorna uma Promise com o array de linhas inseridas ou a linha
    const result = await table.insertRow(rowData);
    
    console.log("✅ [Save] Sucesso! Resposta completa:", result);
    
    // Tratamento para pegar o ID independente do formato de retorno
    const savedId = result.ROWID || (Array.isArray(result) && result[0]?.ROWID) || "ID Desconhecido";
    console.log("🎉 [Save] ID da nova linha:", savedId);
    console.log("💾 [Save] ========================================");
    
    return result;

  } catch (error: any) {
    console.error("❌ [Save] ========================================");
    console.error("❌ [Save] ERRO CRÍTICO!");
    console.error("❌ [Save] Mensagem:", error?.message);
    console.error("❌ [Save] Stack:", error?.stack);
    console.error("❌ [Save] ========================================");
    throw error;
  }
};

// ============================================================================
// 5. FUNÇÕES ADMIN
// ============================================================================
export const updateRaceInDb = async (id: string, data: Partial<Race>) => {
  console.log("✏️ [Update] Atualizando corrida:", id);
  try {
    const table = await getTable();
    const updateData = { ROWID: id, ...data };
    const result = await table.updateRow(updateData);
    console.log("✅ [Update] Sucesso:", result);
    return result;
  } catch (error) {
    console.error("❌ [Update] Erro:", error);
    throw error;
  }
};

export const deleteRaceFromDb = async (id: string) => {
  console.log("🗑️ [Delete] Deletando corrida:", id);
  try {
    const table = await getTable();
    const result = await table.deleteRow(id);
    console.log("✅ [Delete] Sucesso:", result);
    return result;
  } catch (error) {
    console.error("❌ [Delete] Erro:", error);
    throw error;
  }
};

// ============================================================================
// 6. HELPER DE MAPEAMENTO
// ============================================================================
function mapRowToRace(data: any): Race {
  // O Catalyst pode retornar dados aninhados ou diretos dependendo da versão
  const innerData = data.Corridas || data;

  return {
    id: innerData.ROWID,
    name: innerData.name,
    date: innerData.date,
    city: innerData.city,
    state: innerData.state,
    distances: innerData.distances || "",
    image: innerData.image || "",
    link: innerData.link,
    approved: innerData.approved,
    organizer: innerData.organizer,
    description: innerData.description,
    email: innerData.email,
    hasResults: innerData.hasResults || false,
    type: innerData.type || 'rua',
    price: innerData.price || 0,
    location: innerData.location || `${innerData.city}, ${innerData.state}`
  };
}