import { DateSheet } from "./types";
let dateSheets: DateSheet[] = [];

export const getDateSheets = (): DateSheet[] => {
  return dateSheets;
};

export const addDateSheet = (dateSheet: DateSheet): void => {
  dateSheets.push(dateSheet);
};

export const deleteDateSheet = (id: string): void => {
  dateSheets = dateSheets.filter((sheet) => sheet.id !== id);
};

export const getDateSheetById = (id: string): DateSheet | undefined => {
  return dateSheets.find((sheet) => sheet.id === id);
};
