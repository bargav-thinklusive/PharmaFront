export const collectKeys = (obj: any, prefix = ""): string[] => {
  let keys: string[] = [];

  for (let key in obj) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    keys.push(newKey);

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key])
    ) {
      keys = keys.concat(collectKeys(obj[key], newKey));
    }
  }

  return keys;
};

// Function to get all keys from a section (recursively) across ALL items
export const getAllKeysFromSection = (data: any[], section: string): string[] => {
  if (!data || data.length === 0) return [];

  let allKeys: string[] = [];

  for (const item of data) {
    if (item[section]) {
      allKeys = allKeys.concat(collectKeys(item[section]));
    }
  }

  return allKeys; // duplicates preserved
};