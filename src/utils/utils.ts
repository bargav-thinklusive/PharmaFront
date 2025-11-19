import type { DrugEntry } from './types';

export const formatKey = (key: string): string => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};


export const toTitleCase = (str: unknown): string => {
  if (str === null || str === undefined) return "";
  const s = String(str)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const normalizeValue = (value: any): string => {
  const str = String(value).trim().toLowerCase();
  if (str === "" || str === "n/a" || str === "not data") {
    return "No data available";
  }
  return String(value);
};


export const  capitalizeFirstLetter = (
    value: string | undefined | number | Date
  ): string => {
    if (!value || value === "" || value === null) {
      return "----";
    } else if (typeof value === "string") {
      return value.charAt(0).toUpperCase() + value.slice(1);
    } else {
      return String(value); // Convert other types to string without capitalization
    }
  };

// Utility functions for nested object access
export const getNestedValue = (obj: any, path: string): string => {
  return path.split('.').reduce((current, key) => current?.[key] ?? '', obj);
};


export const updateNested = (obj: DrugEntry, path: string, value: string): DrugEntry => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current: any = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return newObj;
};

// Helper to process drug data: formalize by removing empty strings and map to detailed structure
export const processDrugData = (data: any): any => {
  // First, formalize by removing empty strings
  const formalized = formalizeData(data);
  // Then, map to detailed structure
  const { marketInformation, ...rest } = formalized;
  const { version, ...marketInfo } = marketInformation;
  return { version, marketInformation: marketInfo, ...rest };
};

// Helper function to remove empty strings recursively
const formalizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  if (Array.isArray(data)) {
    return data.map(formalizeData).filter(item => item !== null && item !== undefined && item !== '');
  }
  const result: any = {};
  for (const key in data) {
    const value = formalizeData(data[key]);
    if (value !== null && value !== undefined && value !== '') {
      result[key] = value;
    }
  }
  return result;
};