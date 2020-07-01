export const normalizeDbDate = (dateFromDb: Date): Date => {
  if (!dateFromDb) {
    return null;
  }
  const normalizedTimeZone =
    dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000;
  return new Date(normalizedTimeZone);
};
