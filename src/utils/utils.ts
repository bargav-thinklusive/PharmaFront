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



