import { Race } from '@/lib/races-data';

// 🔴 PASSO 1: Substitua este número pelo ID da sua tabela 'Corridas'
const TABLE_IDENTIFIER = '28308000000011134'; // Ex: '1950000000000245' (Se não achar, deixe 'Corridas' mesmo)

// Função que garante que o Catalyst está carregado antes de usar
const getCatalyst = () => {
  const w = window as any;
  
  // Se o objeto catalyst nem existe, é porque o script do index.html falhou
  if (!w.catalyst) {
    throw new Error("⛔ O SDK do Catalyst não foi carregado. Verifique o AdBlock.");
  }

  // Verifica se o banco de dados (datastore) está pronto
  // Às vezes o SDK carrega mas o datastore fica dentro de 'sdk'
  let datastore = w.catalyst.datastore;
  if (!datastore && w.catalyst.sdk && w.catalyst.sdk.datastore) {
      datastore = w.catalyst.sdk.datastore;
  }

  if (!datastore) {
    console.error("❌ ERRO CRÍTICO: O 'catalyst.datastore' está indefinido.");
    throw new Error("Banco de dados não inicializado. Recarregue a página.");
  }

  // Retorna o objeto pronto para uso, garantindo que .table() vai funcionar
  return { ...w.catalyst, datastore }; 
};

// ============================================================================
// BUSCAR CORRIDAS (Leitura)
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  try {
    const catalyst = getCatalyst();
    
    // Usando ZQL para filtrar (exige o NOME da tabela, não o ID)
    const query = "SELECT * FROM Corridas WHERE approved = true"; 
    
    // Proteção extra para o componente ZQL
    if (!catalyst.ZQL) throw new Error("Componente ZQL não carregado.");

    const result = await catalyst.ZQL.executeQuery(query);
    
    if (!result || result.length === 0) return [];

    return result.map((row: any) => {
      const data = row.Corridas; // O Catalyst retorna com o Nome da tabela
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
    });

  } catch (error) {
    console.error("Erro ao buscar:", error);
    return [];
  }
};

// ============================================================================
// SALVAR CORRIDA (Escrita)
// ============================================================================
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 Iniciando gravação...");

  try {
    const catalyst = getCatalyst();
    
    // Aqui usamos o TABLE_IDENTIFIER (seja ID ou Nome)
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

    const insertPromise = table.addRow(rowData);
    const result = await insertPromise;
    console.log("✅ Salvo com sucesso! ID:", result.ROWID);
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