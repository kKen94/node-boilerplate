export const normalizeDbDate = (dateFromDb: Date): Date => {
  const normalizedTimeZone =
    dateFromDb.getTime() - dateFromDb.getTimezoneOffset() * 60000;
  return new Date(normalizedTimeZone);
};
