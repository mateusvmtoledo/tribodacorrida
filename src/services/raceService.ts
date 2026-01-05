import { Race } from '@/lib/races-data';

// 🔴 CONFIGURAÇÃO
const TABLE_IDENTIFIER = '28308000000011134';

// ============================================================================
// 1. OBTER O CATALYST WEB SDK (Sintaxe Antiga)
// ============================================================================
const getCatalyst = () => {
  console.log("🔍 [Catalyst] Verificando SDK no window...");
  
  const w = window as any;
  
  if (!w.catalyst) {
    console.error("❌ [Catalyst] SDK não encontrado no window!");
    throw new Error("SDK do Catalyst não carregado");
  }
  
  console.log("✅ [Catalyst] SDK encontrado:", w.catalyst);
  
  // Verifica se o ZCObject existe (sintaxe antiga do Web SDK)
  if (!w.catalyst.ZCObject) {
    console.error("❌ [Catalyst] ZCObject não encontrado. Versão do SDK incompatível?");
    throw new Error("ZCObject não disponível");
  }
  
  console.log("✅ [Catalyst] ZCObject disponível");
  return w.catalyst;
};

// ============================================================================
// 2. OBTER TABELA (Sintaxe Web SDK Antiga)
// ============================================================================
const getTable = () => {
  console.log("📋 [Table] Obtendo instância da tabela:", TABLE_IDENTIFIER);
  
  const catalyst = getCatalyst();
  
  try {
    // SINTAXE CORRETA DO WEB SDK ANTIGO
    const zcObject = catalyst.ZCObject.getInstance();
    console.log("✅ [Table] ZCObject.getInstance() OK");
    
    const table = zcObject.getTable(TABLE_IDENTIFIER);
    console.log("✅ [Table] Tabela obtida:", table);
    
    return table;
    
  } catch (error) {
    console.error("❌ [Table] Erro ao obter tabela:", error);
    throw error;
  }
};

// ============================================================================
// 3. BUSCAR CORRIDAS
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  console.log("📥 [Fetch] Iniciando busca de corridas...");
  
  try {
    const table = getTable();
    console.log("📊 [Fetch] Chamando getAllRows()...");
    
    // Web SDK antigo usa getAllRows()
    const rows = await table.getAllRows();
    console.log(`✅ [Fetch] ${rows.length} linhas retornadas`);
    
    if (!rows || rows.length === 0) {
      console.warn("⚠️ [Fetch] Nenhuma linha encontrada");
      return [];
    }

    const races = rows
      .map((row: any) => {
        console.log("🔄 [Fetch] Processando linha:", row);
        return mapRowToRace(row);
      })
      .filter((r: Race) => r.approved);

    console.log(`✅ [Fetch] ${races.length} corridas aprovadas retornadas`);
    return races;

  } catch (error) {
    console.error("❌ [Fetch] Erro:", error);
    return [];
  }
};

// ============================================================================
// 4. SALVAR CORRIDA (COM LOGS DETALHADOS)
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [Save] ========================================");
  console.log("💾 [Save] Iniciando gravação...");
  console.log("💾 [Save] Tabela:", TABLE_IDENTIFIER);
  console.log("💾 [Save] Dados recebidos:", raceData);

  try {
    // 1. Obter tabela
    console.log("📋 [Save] Etapa 1: Obtendo tabela...");
    const table = getTable();
    console.log("✅ [Save] Tabela obtida:", table);

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

    // 3. Inserir
    console.log("📤 [Save] Etapa 3: Chamando table.addRow()...");
    const result = await table.addRow(rowData);
    
    console.log("✅ [Save] Sucesso! Resposta:", result);
    console.log("💾 [Save] ========================================");
    
    return result;

  } catch (error: any) {
    console.error("❌ [Save] ========================================");
    console.error("❌ [Save] ERRO CRÍTICO!");
    console.error("❌ [Save] Tipo:", error?.constructor?.name);
    console.error("❌ [Save] Mensagem:", error?.message);
    console.error("❌ [Save] Stack:", error?.stack);
    console.error("❌ [Save] Objeto completo:", error);
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
    const table = getTable();
    const updateData = { ROWID: id, ...data };
    
    console.log("📤 [Update] Dados:", updateData);
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
    const table = getTable();
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
  console.log("🔄 [Map] Mapeando dados:", data);
  
  const mapped = {
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
  
  console.log("✅ [Map] Resultado:", mapped);
  return mapped;
}