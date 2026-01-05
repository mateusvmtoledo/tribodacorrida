export const initCatalyst = () => {
  const catalyst = (window as any).catalyst;
  if (!catalyst) return null;
  try {
    catalyst.init();
  } catch (e) {}
  return catalyst;
};

export const getTable = (tableName: string) => {
    const catalyst = (window as any).catalyst;
    if (!catalyst) return null;
    return catalyst.ZCObject.getInstance().getTable(tableName);
};