import { Race } from '@/lib/races-data';

// Função auxiliar para pegar o Catalyst do navegador
const getCatalyst = () => {
  const cat = (window as any).catalyst;
  if (!cat) {
    throw new Error("SDK do Catalyst não inicializado.");
  }
  return cat;
};

export const fetchRacesFromDb = async (): Promise<Race[]> => {
  try {
    const catalyst = getCatalyst();
    
    // ZQL é a linguagem de consulta do Zoho (parecido com SQL)
    // Buscamos apenas as corridas aprovadas para exibir na lista pública
    const query = "SELECT * FROM Corridas WHERE approved = true"; 
    
    const queryPromise = catalyst.ZQL.executeQuery(query);
    const rows = await queryPromise;

    if (!rows || rows.length === 0) return [];

    // Mapeia o resultado do banco (Corridas) para o nosso formato (Race)
    return rows.map((row: any) => {
      const data = row.Corridas; // O Catalyst devolve um objeto com o nome da tabela
      return {
        id: data.ROWID,
        name: data.name,
        date: data.date,
        city: data.city,
        state: data.state,
        distances: data.distances,
        organizer: data.organizer,
        image: data.image || "https://images.unsplash.com/photo-1532443603122-ad161ff16c90?w=800&q=80",
        link: data.link, // <--- GARANTINDO QUE O LINK VENHA
        approved: data.approved,
        hasResults: data.hasResults || false
      };
    });
  } catch (error) {
    console.error("Erro ao buscar corridas:", error);
    return [];
  }
};

export const addRaceToDb = async (race: Omit<Race, 'id'>) => {
  try {
    const catalyst = getCatalyst();
    const table = catalyst.datastore.table('Corridas');

    console.log("Tentando salvar corrida:", race);

    // Cria o objeto EXATO que o banco espera
    const rowData = {
      name: race.name,
      date: race.date,
      city: race.city,
      state: race.state,
      distances: race.distances,
      organizer: race.organizer,
      link: race.link, // <--- AQUI ESTÁ A CHAVE: link minúsculo
      approved: false // Toda nova corrida entra como não aprovada
    };

    const insertPromise = table.addRow(rowData);
    const row = await insertPromise;
    console.log("Corrida salva com sucesso:", row);
    return row;
  } catch (error: any) {
    console.error("Erro detalhado do Catalyst:", error);
    // Lança o erro para a tela de Cadastro mostrar o alerta
    throw error;
  }
};

// Funções para a Torre de Controle (Update/Delete)
export const updateRaceInDb = async (id: string, data: Partial<Race>) => {
  const catalyst = getCatalyst();
  const table = catalyst.datastore.table('Corridas');
  
  const updateData = {
    ROWID: id,
    ...data
  };
  
  return await table.updateRow(updateData);
};

export const deleteRaceFromDb = async (id: string) => {
  const catalyst = getCatalyst();
  const table = catalyst.datastore.table('Corridas');
  return await table.deleteRow(id);
};