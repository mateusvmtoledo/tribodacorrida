export const initCatalyst = () => {
  // O script do HTML cria uma variável global chamada 'catalyst'
  // Usamos (window as any) para o TypeScript não reclamar
  const catalyst = (window as any).catalyst;
  
  if (!catalyst) {
    console.error("ERRO: O SDK do Catalyst não foi carregado. Verifique o index.html");
    return null;
  }

  try {
    // Inicializa o SDK
    catalyst.init();
  } catch (e) {
    // Se já estiver inicializado, apenas ignora
  }
  
  return catalyst;
};

// Função auxiliar para pegar a tabela
export const getTable = (tableName: string) => {
    const catalyst = (window as any).catalyst;
    if (!catalyst) return null;
    
    // Sintaxe específica do Web SDK para acessar tabelas
    return catalyst.ZCObject.getInstance().getTable(tableName);
};