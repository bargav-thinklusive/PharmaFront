// Utility functions for UniversalDataRenderer
import { formatKey as _formatKey } from '../../utils/utils';

// Re-export formatKey for use in renderers
export const formatKey = _formatKey;

export const hasContent = (val: any): boolean => {
  if (val === null || val === undefined) return false;
  if (typeof val === "string" && val.trim() === "") return false;
  if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
  if (Array.isArray(val) && val.length === 0) return false;
  if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
  return true;
};

export const isPlainObject = (val: any): val is Record<string, any> =>
  typeof val === "object" && val !== null && !Array.isArray(val);

export const isUrl = (text: string): boolean => {
  const urlRegex = /^https?:\/\/[^\s]+$/i;
  return urlRegex.test(text.trim());
};

export const isAppendixReference = (text: string): boolean => {
  return /appendix\s+\d+/i.test(text);
};

// Constants
export const MAX_TABLE_SIZE = 10;
export const APPENDIX_KEYS = ['appendix1', 'appendix2', 'appendix3', 'appendix4', 'appendix5'] as const;

// Drug substance subsections configuration
export const DRUG_SUBSTANCE_SUBSECTIONS = [
  { key: 'physicalAndChemicalProperties', title: 'Physical And Chemical Properties', id: '3-1' },
  { key: 'processDevelopment', title: 'Process Development', id: '3-2' },
  { key: 'analyticalDevelopment', title: 'Analytical Development', id: '3-3' }
] as const;

// Section identifiers
export const SECTION_IDS = {
  MARKET_INFO: 'section-2',
  DRUG_SUBSTANCE: 'section-3',
  DRUG_PRODUCT: 'section-4',
  APPENDICES: 'section-5',
  REFERENCES: 'section-6',
  MANUFACTURING_SITES: 'section-3-2-1'
} as const;

// CSS Classes
export const STYLES = {
  mainTitle: "text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4",
  subsectionTitle: "text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4",
  subsubsectionTitle: "text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2",
  smallTitle: "font-semibold border-blue-400 border-b-2 pb-1",
  table: "border-2 border-sky-400 rounded bg-white max-w-3xl",
  tableHeader: "w-1/2 p-3 text-black font-semibold text-left",
  tableCell: "py-2 px-4",
  noData: "text-gray-500 italic",
  link: "text-blue-600 underline hover:text-blue-800",
  list: "list-disc ml-5 space-y-1"
} as const;