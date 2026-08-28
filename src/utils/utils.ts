
export const formatKey = (key: string): string => {
  if (key === 'createdByName') return 'Created By';
  if (key === 'updatedByName') return 'Updated By';
  if (key === 'createdAt') return 'Created At';
  if (key === 'updatedAt') return 'Updated At';
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

export const formatDraftDate = (val: any): string => {
  if (!val) return "Unknown date";
  let date: Date;
  if (typeof val === 'number') {
    date = val > 4102444800 ? new Date(val) : new Date(val * 1000);
  } else if (typeof val === 'string') {
    let str = val.trim();
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      date = num > 4102444800 ? new Date(num) : new Date(num * 1000);
    } else {
      if (str.includes('T') && !str.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(str)) {
        str += 'Z';
      } else if (!str.includes('T') && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(str)) {
        str = str.replace(' ', 'T') + 'Z';
      }
      date = new Date(str);
    }
  } else {
    date = new Date(val);
  }

  if (isNaN(date.getTime())) {
    return String(val);
  }

  const userLocale = typeof navigator !== 'undefined' ? navigator.language : undefined;

  return date.toLocaleString(userLocale, {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

export const getDraftTime = (d: any): number => {
  const val = d?.lastModified ?? d?.updatedAt ?? d?.createdAt;
  if (!val) return 0;
  if (typeof val === 'number') {
    return val > 4102444800 ? val : val * 1000;
  }
  if (typeof val === 'string') {
    let str = val.trim();
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      return num > 4102444800 ? num : num * 1000;
    }
    if (str.includes('T') && !str.endsWith('Z') && !/[+-]\d{2}:\d{2}$/.test(str)) {
      str += 'Z';
    } else if (!str.includes('T') && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(str)) {
      str = str.replace(' ', 'T') + 'Z';
    }
    const parsed = new Date(str).getTime();
    return isNaN(parsed) ? 0 : parsed;
  }
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

export const findExistingDraft = (drafts: any[], flatData: any): any => {
  if (!drafts || !Array.isArray(drafts) || !flatData) return null;
  
  const targetDrugName = (flatData.drugName || flatData.ProductOverview?.drugName || "").trim().toLowerCase();
  const targetCid = flatData.cid ? String(flatData.cid) : null;
  const targetId = flatData._id || flatData.id ? String(flatData._id || flatData.id) : null;

  return drafts.find((d: any) => {
    if (!d) return false;
    const fData = d.formData || {};
    
    // 1. Match by drug ID in formData
    if (targetId && (String(fData._id) === targetId || String(fData.id) === targetId)) return true;
    
    // 2. Match by CID in formData
    if (targetCid && fData.cid && String(fData.cid) === targetCid) return true;
    
    // 3. Match by drugName
    const dName = (d.drugName || fData.drugName || fData.ProductOverview?.drugName || "").trim().toLowerCase();
    if (targetDrugName && dName && dName === targetDrugName) return true;

    return false;
  });
};

export const getNextVersion = (currentVer: any): string => {
  if (!currentVer && currentVer !== 0) return "1.1";
  const str = String(currentVer).trim();
  const num = parseFloat(str);
  if (!isNaN(num)) {
    const next = (num + 0.1).toFixed(1);
    return next;
  }
  return str;
};

/**
 * Converts a Unix timestamp (seconds) to a readable date string (Jan-DD-YYYY).
 */
export const unixToDate = (unix: number | string | Date | null | undefined): string => {
  if (!unix || unix === "No data available") return "No data available";
  let date: Date | null = null;
  if (typeof unix === 'number') {
    date = unix > 4102444800 ? new Date(unix) : new Date(unix * 1000);
  } else if (typeof unix === 'string') {
    const str = unix.trim();
    if (/^\d+$/.test(str)) {
      const num = parseInt(str, 10);
      date = num > 4102444800 ? new Date(num) : new Date(num * 1000);
    } else {
      let isoStr = str;
      if (isoStr.includes('T') && !isoStr.endsWith('Z') && !/[+-]\d{2}(:\d{2})?$/.test(isoStr)) {
        isoStr += 'Z';
      } else if (!isoStr.includes('T') && /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}/.test(isoStr)) {
        isoStr = isoStr.replace(' ', 'T') + 'Z';
      }
      const parsed = new Date(isoStr);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
      }
    }
  } else if (unix instanceof Date) {
    date = unix;
  }

  if (date && !isNaN(date.getTime())) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
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

export const valueFormatter = (params: { value?: any; colDef?: any }): string => {
  if (params.value == null) return "-";

  const field = params.colDef?.field || "";

  if (field.toLowerCase().includes('date') || field === 'createdAt' || field === 'updatedAt' || (typeof params.value === 'number' && params.value > 100000000)) {
    return unixToDate(params.value);
  }

  if (typeof params.value === "string") {
    if (params.value.includes("@")) return params.value;
    return capitalizeFirstLetter(params.value);
  }

  if (typeof params.value === "object") {
    const entries = Object.entries(params.value).filter(([_, val]) => val && typeof val === 'string' && val.trim());
    if (entries.length > 0) {
      return entries.map(([key, val]) => `${key}: ${val}`).join('; ');
    }
    return "-";
  }

  return String(params.value);
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

/**
 * Converts a File object to a Base64 string.
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Helper to process drug data: formalize by removing empty strings and map to detailed structure
export const processDrugData = (data: any): any => {
  // First, formalize by removing empty strings
  const formalized = formalizeData(data);
  // Then, map to detailed structure
  const { productOverview, ...rest } = formalized;
  const { version, ...productInfo } = productOverview;
  return { version, productOverview: productInfo, ...rest };
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

/**
 * Tracks the search/view of a drug by its exact name, incrementing its count in localStorage.
 */
export const trackDrugSearch = (drugName: string) => {
  if (!drugName || !drugName.trim()) return;
  try {
    const history = JSON.parse(localStorage.getItem("search_history") || "{}");
    const key = drugName.trim();
    history[key] = (history[key] || 0) + 1;
    localStorage.setItem("search_history", JSON.stringify(history));
  } catch (e) {
    console.error(e);
  }
};