import { Race } from '@/lib/races-data';

// 🔴 CONFIGURAÇÃO
const TABLE_IDENTIFIER = '28308000000011134';

// ============================================================================
// 1. AGUARDAR O CATALYST ESTAR PRONTO (Inicializado no HTML)
// ============================================================================
const waitForCatalyst = async (): Promise<any> => {
  console.log("⏳ [Wait] Aguardando Catalyst estar pronto...");
  
  const w = window as any;
  
  // Aguarda até o catalyst estar disponível (max 10 segundos)
  for (let i = 0; i < 100; i++) {
    if (w.catalyst && w.catalystReady) {
      console.log("✅ [Wait] Catalyst pronto após", i * 100, "ms");
      return w.catalyst;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  throw new Error("Timeout: Catalyst não inicializou em 10 segundos");
};

// ============================================================================
// 2. OBTER TABELA
// ============================================================================
const getTable = async () => {
  console.log("📋 [Table] ========================================");
  console.log("📋 [Table] Obtendo tabela:", TABLE_IDENTIFIER);

  const catalyst = await waitForCatalyst();
  
  console.log("🔍 [Table] Catalyst disponível:", catalyst);
  console.log("🔍 [Table] Propriedades:", Object.keys(catalyst));
  console.log("🔍 [Table] Protótipo:", Object.getOwnPropertyNames(Object.getPrototypeOf(catalyst)));

  // Tenta diferentes sintaxes do SDK
  let table;
  
  try {
    // SDK 4.x - Sintaxe 1: catalyst.datastore().table()
    if (typeof catalyst.datastore === 'function') {
      console.log("🔧 [Table] Tentando catalyst.datastore().table()...");
      const datastore = catalyst.datastore();
      console.log("🔍 [Table] Datastore obtido:", datastore);
      console.log("🔍 [Table] Métodos do datastore:", Object.keys(datastore));
      
      if (typeof datastore.table === 'function') {
        table = datastore.table(TABLE_IDENTIFIER);
      }
    }
    // SDK 4.x - Sintaxe 2: catalyst.datastore.table()
    else if (catalyst.datastore && typeof catalyst.datastore.table === 'function') {
      console.log("🔧 [Table] Tentando catalyst.datastore.table()...");
      table = catalyst.datastore.table(TABLE_IDENTIFIER);
    }
    // SDK 4.x - Sintaxe 3: catalyst.table()
    else if (typeof catalyst.table === 'function') {
      console.log("🔧 [Table] Tentando catalyst.table()...");
      table = catalyst.table(TABLE_IDENTIFIER);
    }
    // SDK antigo - Sintaxe 4: ZCObject
    else if (catalyst.ZCObject) {
      console.log("🔧 [Table] Tentando ZCObject.getInstance()...");
      const zcObject = catalyst.ZCObject.getInstance();
      table = zcObject.getTable(TABLE_IDENTIFIER);
    }
    else {
      console.error("❌ [Table] NENHUMA API ENCONTRADA!");
      console.error("💡 [Table] Tente chamar no console: window.catalyst");
      console.error("💡 [Table] E veja o que tem disponível");
      throw new Error("API de tabela não disponível");
    }
    
    console.log("✅ [Table] Tabela obtida:", table);
    console.log("📋 [Table] ========================================");
    
    return table;
    
  } catch (error) {
    console.error("❌ [Table] Erro:", error);
    console.log("📋 [Table] ========================================");
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
    
    console.log("✅ [Fetch] Resposta:", result);
    
    // Tenta diferentes formatos de resposta
    const rows = result?.data || result?.rows || result || [];
    console.log(`✅ [Fetch] ${rows.length} linhas encontradas`);
    
    if (!rows || rows.length === 0) {
      console.warn("⚠️ [Fetch] Nenhuma linha retornada");
      return [];
    }

    const races = rows
      .map((row: any) => {
        console.log("🔄 [Fetch] Linha:", row);
        return mapRowToRace(row);
      })
      .filter((r: Race) => r.approved);

    console.log(`✅ [Fetch] ${races.length} corridas aprovadas`);
    console.log("📥 [Fetch] ========================================");
    
    return races;

  } catch (error) {
    console.error("❌ [Fetch] Erro:", error);
    console.log("📥 [Fetch] ========================================");
    return [];
  }
};

// ============================================================================
// 4. SALVAR CORRIDA
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [Save] ========================================");
  console.log("💾 [Save] Iniciando gravação...");
  console.log("💾 [Save] Tabela:", TABLE_IDENTIFIER);
  console.log("💾 [Save] Dados:", raceData);

  try {
    const table = await getTable();
    console.log("✅ [Save] Tabela obtida");
    
    console.log("🔍 [Save] Métodos da tabela:", Object.keys(table));

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

    console.log("📦 [Save] rowData preparado:", rowData);

    // Tenta diferentes métodos de inserção
    let result;
    
    if (typeof table.insertRow === 'function') {
      console.log("📤 [Save] Usando table.insertRow()...");
      result = await table.insertRow(rowData);
    } else if (typeof table.addRow === 'function') {
      console.log("📤 [Save] Usando table.addRow()...");
      result = await table.addRow(rowData);
    } else if (typeof table.create === 'function') {
      console.log("📤 [Save] Usando table.create()...");
      result = await table.create(rowData);
    } else {
      console.error("❌ [Save] Nenhum método de inserção encontrado!");
      console.error("💡 [Save] Métodos disponíveis:", Object.keys(table));
      throw new Error("Método de inserção não disponível");
    }
    
    console.log("✅ [Save] Sucesso! Resposta:", result);
    console.log("🎉 [Save] ID:", result?.ROWID);
    console.log("💾 [Save] ========================================");
    
    return result;

  } catch (error: any) {
    console.error("❌ [Save] ========================================");
    console.error("❌ [Save] ERRO!", error);
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
// 6. HELPER
// ============================================================================
function mapRowToRace(data: any): Race {
  console.log("🔄 [Map] Input:", data);
  
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
  
  console.log("✅ [Map] Output:", mapped);
  return mapped;
}