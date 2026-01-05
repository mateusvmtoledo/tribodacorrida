// src/services/raceService.ts
import { Race } from '@/lib/races-data';

// Função auxiliar para garantir que o SDK do Catalyst está carregado
const getCatalyst = () => {
  const cat = (window as any).catalyst;
  if (!cat) {
    console.error("❌ ERRO CRÍTICO: SDK do Catalyst não encontrado no objeto window.");
    throw new Error("SDK do Catalyst não inicializado. Verifique o index.html.");
  }
  return cat;
};

// ============================================================================
// BUSCAR CORRIDAS (Leitura)
// ============================================================================
export const fetchRacesFromDb = async (): Promise<Race[]> => {
  console.log("📡 [RaceService] Iniciando busca de corridas no banco...");
  try {
    const catalyst = getCatalyst();
    
    // Busca apenas as aprovadas para exibir na home
    const query = "SELECT * FROM Corridas WHERE approved = true";
    
    const queryPromise = catalyst.ZQL.executeQuery(query);
    const rows = await queryPromise;

    if (!rows || rows.length === 0) {
      console.warn("⚠️ [RaceService] Nenhuma corrida encontrada no banco.");
      return [];
    }

    console.log(`✅ [RaceService] ${rows.length} corridas encontradas. Processando dados...`);

    // Mapeia os dados brutos do Catalyst para nossa interface Race
    const mappedRaces = rows.map((row: any) => {
      const data = row.Corridas; // O Catalyst agrupa os dados pelo nome da tabela
      return {
        id: data.ROWID,
        name: data.name,
        date: data.date,
        city: data.city,
        state: data.state,
        distances: data.distances || "", // Garante que não venha nulo
        image: data.image || "https://images.unsplash.com/photo-1532443603122-ad161ff16c90?w=800&q=80",
        link: data.link,
        approved: data.approved,
        organizer: data.organizer,
        description: data.description,
        hasResults: data.hasResults || false
      };
    });

    return mappedRaces;

  } catch (error) {
    console.error("❌ [RaceService] Erro ao buscar corridas:", error);
    return [];
  }
};

// ============================================================================
// CRIAR CORRIDA (Escrita)
// ============================================================================
// Recebe um objeto Race sem o ID (porque o banco gera o ID)
export const addRaceToDb = async (raceData: Omit<Race, 'id'>) => {
  console.log("💾 [RaceService] Preparando para salvar nova corrida:", raceData);

  try {
    const catalyst = getCatalyst();
    const table = catalyst.datastore.table('Corridas');

    // Mapeamento explícito para garantir que os campos batam com as colunas do banco
    // ATENÇÃO: Se o nome da coluna no banco mudar, precisa mudar aqui também.
    const rowData = {
      name: raceData.name,
      date: raceData.date,
      city: raceData.city,
      state: raceData.state,
      distances: raceData.distances, // String já formatada "5k, 10k"
      organizer: raceData.organizer || "Não informado",
      email: raceData.email || "",
      description: raceData.description || "",
      
      link: raceData.link, // OBRIGATÓRIO: Tem que ser URL válida (https://...)
      
      approved: false,     // Padrão: Pendente de aprovação
      image: raceData.image || ""
    };

    console.log("📤 [RaceService] Enviando payload para o Catalyst:", rowData);

    const insertPromise = table.addRow(rowData);
    const result = await insertPromise;

    console.log("✅ [RaceService] Corrida salva com sucesso! ID:", result.ROWID);
    return result;

  } catch (error: any) {
    console.error("❌ [RaceService] Falha ao salvar no banco.", error);
    
    // Log extra para ajudar a identificar erro de coluna ou permissão
    if (error.message && error.message.includes("column")) {
      console.error("💡 DICA: Verifique se o nome das colunas no código bate com o Data Store.");
    }
    throw error;
  }
};

// ============================================================================
// ATUALIZAR E DELETAR (Torre de Controle)
// ============================================================================
export const updateRaceInDb = async (id: string, data: Partial<Race>) => {
  console.log(`🔄 [RaceService] Atualizando corrida ID ${id}...`, data);
  const catalyst = getCatalyst();
  const table = catalyst.datastore.table('Corridas');
  
  const updateData = {
    ROWID: id,
    ...data
  };
  
  return await table.updateRow(updateData);
};

export const deleteRaceFromDb = async (id: string) => {
  console.log(`🗑️ [RaceService] Deletando corrida ID ${id}...`);
  const catalyst = getCatalyst();
  const table = catalyst.datastore.table('Corridas');
  return await table.deleteRow(id);
};