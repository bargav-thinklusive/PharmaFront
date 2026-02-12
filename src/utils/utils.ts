
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

/**
 * Converts a Unix timestamp (seconds) to a readable date string (Jan-DD-YYYY).
 */
export const unixToDate = (unix: number | string | null | undefined): string => {
  if (!unix || unix === "No data available") return "No data available";
  const timestamp = typeof unix === 'string' ? parseInt(unix) : unix;
  if (isNaN(timestamp)) return String(unix);

  // Heuristic: Check if it's likely a Unix timestamp in seconds (between 1970 and 2100)
  if (timestamp > 100000000 && timestamp < 4102444800) {
    const date = new Date(timestamp * 1000);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getUTCMonth()];
    const day = String(date.getUTCDate()).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${month}-${day}-${year}`;
  }
  return String(unix);
};

export const normalizeValue = (value: any): string => {
  if (value === null || value === undefined || value === "") {
    return "No data available";
  }

  const str = String(value).trim().toLowerCase();
  if (str === "n/a" || str === "not data") {
    return "No data available";
  }

  // Handle Unix timestamps
  if (typeof value === 'number' || (typeof value === 'string' && /^\d{10}$/.test(value))) {
    const timestamp = typeof value === 'string' ? parseInt(value) : value;
    if (timestamp > 100000000 && timestamp < 4102444800) {
      return unixToDate(timestamp);
    }
  }

  return String(value);
};


export const capitalizeFirstLetter = (
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


export const updateNested = (obj: any, path: string, value: any): any => {
  const keys = path.split('.');
  const newObj = { ...obj };
  let current: any = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    current[keys[i]] = { ...current[keys[i]] };
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return newObj;
};

/**
 * Converts a date string or Date object to a Unix timestamp (seconds).
 */
export const dateToUnix = (date: string | number | Date | null | undefined): number | null => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return Math.floor(d.getTime() / 1000);
};

/**
 * Recursively converts date fields in an object to Unix timestamps.
 */
export const convertDatesToUnix = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;

  if (Array.isArray(data)) {
    return data.map(convertDatesToUnix);
  }

  const result: any = {};
  for (const key in data) {
    let value = data[key];

    // Check if the key suggests a date field
    const isDateKey = key.toLowerCase().includes('date');

    if (isDateKey && value && (typeof value === 'string' || value instanceof Date)) {
      const unix = dateToUnix(value);
      result[key] = unix !== null ? unix : value;
    } else if (typeof value === 'object') {
      result[key] = convertDatesToUnix(value);
    } else {
      result[key] = value;
    }
  }
  return result;
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