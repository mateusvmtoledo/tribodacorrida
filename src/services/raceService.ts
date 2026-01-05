// ============================================================================
// raceService.ts - VERSÃO COMPLETA CSV + CATALYST
// ============================================================================

import { Race } from '@/lib/races-data';

const TABLE_IDENTIFIER = '28308000000011134';
const PROJECT_ID = "28308000000011085";
const ZAID = "50037517394";

// ============================================================================
// 1. INICIALIZAÇÃO DO CATALYST (SDK 4.5.0)
// ============================================================================
let catalystApp: any = null;
let isInitialized = false;

const initCatalyst = async () => {
  if (isInitialized && catalystApp) {
    console.log("✅ [Catalyst] Já inicializado");
    return catalystApp;
  }

  console.log("🚀 [Catalyst] Iniciando SDK 4.5.0...");

  const w = window as any;
  
  if (!w.catalyst) {
    throw new Error("❌ SDK do Catalyst não carregado no window");
  }

  try {
    // SDK 4.5.0: Precisa criar credenciais e inicializar
    console.log("🔧 [Catalyst] Criando credenciais...");
    
    // Cria as credenciais
    const credentials = {
      projectId: PROJECT_ID,
      zaid: ZAID
    };

    // Inicializa o Catalyst com as credenciais
    console.log("🔧 [Catalyst] Chamando w.catalyst.auth.init()...");
    
    // Tenta inicializar (pode variar dependendo da versão exata)
    if (w.catalyst.auth && typeof w.catalyst.auth.init === 'function') {
      await w.catalyst.auth.init(credentials);
      catalystApp = w.catalyst;
    } else if (typeof w.catalyst.init === 'function') {
      catalystApp = w.catalyst.init(credentials);
    } else {
      // Fallback: usa direto
      catalystApp = w.catalyst;
    }

    // Aguarda um pouco para garantir que está pronto
    await new Promise(resolve => setTimeout(resolve, 300));

    isInitialized = true;
    console.log("✅ [Catalyst] Inicializado com sucesso!");
    console.log("📦 [Catalyst] App:", catalystApp);

    return catalystApp;

  } catch (error) {
    console.error("❌ [Catalyst] Erro na inicialização:", error);
    throw error;
  }
};

// ============================================================================
// 2. OBTER TABELA
// ============================================================================
const getTable = async () => {
  console.log("📋 [Table] Obtendo tabela:", TABLE_IDENTIFIER);

  const app = await initCatalyst();

  try {
    // SDK 4.5.0: Acessa o datastore
    let table;

    if (app.datastore && typeof app.datastore.table === 'function') {
      console.log("🔧 [Table] Usando app.datastore.table()");
      table = app.datastore.table(TABLE_IDENTIFIER);
    } else if (typeof app.table === 'function') {
      console.log("🔧 [Table] Usando app.table()");
      table = app.table(TABLE_IDENTIFIER);
    } else {
      throw new Error("Não encontrei um método para acessar a tabela");
    }

    console.log("✅ [Table] Tabela obtida:", table);
    return table;

  } catch (error) {
    console.error("❌ [Table] Erro:", error);
    throw error;
  }
};

// ============================================================================
// 3. BUSCAR CORRIDAS DO CATALYST (para combinar com CSV)
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  console.log("📥 [Fetch] Buscando corridas do Catalyst...");
  
  try {
    const table = await getTable();
    
    console.log("📊 [Fetch] Chamando getRows()...");
    const result = await table.getRows();
    
    console.log("✅ [Fetch] Resposta:", result);
    
    // Tenta diferentes formatos de resposta
    const rows = result?.data || result?.rows || result || [];
    console.log(`✅ [Fetch] ${rows.length} linhas no Catalyst`);
    
    if (!rows || rows.length === 0) {
      console.warn("⚠️ [Fetch] Nenhuma corrida no Catalyst ainda");
      return [];
    }

    const races = rows
      .map((row: any) => {
        console.log("🔄 [Fetch] Processando:", row);
        return mapRowToRace(row);
      })
      .filter((r: Race) => r.approved);

    console.log(`✅ [Fetch] ${races.length} corridas aprovadas retornadas`);
    return races;

  } catch (error) {
    console.error("❌ [Fetch] Erro ao buscar do Catalyst:", error);
    // Não falha - apenas retorna array vazio se der erro
    return [];
  }
};

// ============================================================================
// 4. SALVAR NOVA CORRIDA NO CATALYST
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [Save] ========================================");
  console.log("💾 [Save] Salvando nova corrida...");
  console.log("💾 [Save] Dados:", raceData);

  try {
    const table = await getTable();
    console.log("✅ [Save] Tabela pronta");

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
      approved: false, // Sempre pendente no início
      hasResults: false,
      image: raceData.image || "",
      type: raceData.type || 'rua',
      price: raceData.price || 0,
      location: raceData.location || `${raceData.city}, ${raceData.state}`
    };

    console.log("📦 [Save] Dados preparados:", rowData);

    // Tenta diferentes métodos de inserção
    let result;
    
    if (typeof table.insertRow === 'function') {
      console.log("📤 [Save] Chamando table.insertRow()...");
      result = await table.insertRow(rowData);
    } else if (typeof table.addRow === 'function') {
      console.log("📤 [Save] Chamando table.addRow()...");
      result = await table.addRow(rowData);
    } else {
      throw new Error("Nenhum método de inserção disponível");
    }
    
    console.log("✅ [Save] SUCESSO! Resposta:", result);
    console.log("🎉 [Save] Novo ID:", result?.ROWID);
    console.log("💾 [Save] ========================================");
    
    return result;

  } catch (error: any) {
    console.error("❌ [Save] ========================================");
    console.error("❌ [Save] ERRO AO SALVAR!");
    console.error("❌ [Save] Tipo:", error?.constructor?.name);
    console.error("❌ [Save] Mensagem:", error?.message);
    console.error("❌ [Save] Stack:", error?.stack);
    console.error("💾 [Save] ========================================");
    throw error;
  }
};

// ============================================================================
// 5. FUNÇÕES ADMIN
// ============================================================================
export const updateRaceInDb = async (id: string, data: Partial<Race>) => {
  console.log("✏️ [Update] Atualizando:", id);
  
  try {
    const table = await getTable();
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
  console.log("🗑️ [Delete] Deletando:", id);
  
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