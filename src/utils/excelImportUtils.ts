import * as XLSX from 'xlsx';
import type { FieldConfig } from '../components/shared';

export interface MappingResult {
    mappedData: any;
    unmappedFields: string[];
    mappingDetails: Array<{ excelHeader: string; formField: string | null }>;
}

/**
 * Parse an Excel or CSV file and return the data as an array of objects
 * Handles both standard table format and transposed key-value format
 */
export const parseExcelFile = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });

                // Get the first sheet
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                // Convert to JSON with header option
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                    raw: false,
                    defval: '',
                    header: 1 // Get as array of arrays
                }) as any[][];

                if (jsonData.length === 0) {
                    resolve([]);
                    return;
                }

                // Detect format and convert
                const converted = convertExcelDataToObjects(jsonData);
                resolve(converted);
            } catch (error) {
                reject(new Error(`Failed to parse Excel file: ${error}`));
            }
        };

        reader.onerror = () => {
            reject(new Error('Failed to read file'));
        };

        reader.readAsBinaryString(file);
    });
};

/**
 * Convert Excel data to objects based on detected format
 */
const convertExcelDataToObjects = (data: any[][]): any[] => {
    if (data.length === 0) return [];

    // Check if it's a standard table (headers in first row)
    const firstRow = data[0];
    const hasHeadersInFirstRow = firstRow.filter(Boolean).length > 2 &&
        firstRow.every((cell: any) => !cell || typeof cell === 'string');

    if (hasHeadersInFirstRow && !isTransposedFormat(data)) {
        // Standard table format
        const headers = data[0];
        const dataRows = data.slice(1);
        return dataRows
            .filter(row => row.some(cell => cell && cell.toString().trim() !== ''))
            .map(row => {
                const obj: any = {};
                headers.forEach((header, index) => {
                    if (header) {
                        obj[header] = row[index] || '';
                    }
                });
                return obj;
            });
    }

    // Transposed format - field names in column B (index 1), values in column C+ (index 2+)
    return convertTransposedToStandard(data);
};

/**
 * Detect if Excel is in transposed format
 */
const isTransposedFormat = (data: any[][]): boolean => {
    if (data.length < 3) return false;

    let fieldNameCountInColB = 0;

    // Check column B (index 1) for field names
    for (let i = 0; i < Math.min(20, data.length); i++) {
        const colB = data[i][1]; // Column B
        if (colB && !colB.toString().startsWith('#') && isLikelyFieldName(colB)) {
            fieldNameCountInColB++;
        }
    }

    // If more than 40% of rows in column B look like field names, it's transposed
    return fieldNameCountInColB > (Math.min(20, data.length) * 0.4);
};

/**
 * Check if a value looks like a field name
 */
const isLikelyFieldName = (value: any): boolean => {
    const str = value.toString().trim();
    if (str.length === 0 || str.length > 100) return false;

    // Common field name patterns
    const fieldNamePatterns = [
        /^[A-Z][a-z]+(\s+[A-Z][a-z]+)*$/,  // Title Case
        /Name$/i,
        /Date$/i,
        /Number$/i,
        /Type$/i,
        /Code$/i,
        /Status$/i,
        /Form$/i,
        /Class$/i,
        /Weight$/i,
        /Formula$/i,
        /Action$/i,
        /Information$/i,
        /Strength$/i,
        /Region$/i,
        /Solubility$/i,
        /Process$/i,
        /Details$/i,
        /Dose$/i,
    ];

    return fieldNamePatterns.some(pattern => pattern.test(str));
};

/**
 * Check if a cell value looks like a short label/header (not a URL or long text)
 */
const isShortLabel = (val: string): boolean => {
    if (!val || val.length === 0) return false;
    if (val.length > 80) return false;                    // too long to be a header
    if (val.startsWith('http') || val.startsWith('www')) return false; // URL
    return true;
};

/**
 * Check if a row looks like a table header row:
 * - Has 3 or more non-empty short-label columns starting from col B (index 1)
 */
const isTableHeaderRow = (row: any[]): boolean => {
    const cols = row.slice(1); // from col B onwards
    const nonEmptyShortCols = cols.filter((c: any) => {
        const s = c?.toString().trim() || '';
        return isShortLabel(s);
    });
    return nonEmptyShortCols.length >= 3;
};

/**
 * Convert transposed format to standard table format.
 * - Simple rows: col B = field name, col C = value
 * - Table header rows (3+ short labels across cols B,C,D...): start a table context
 * - Table data rows: rows that follow a table header with values in the same columns
 */
const convertTransposedToStandard = (data: any[][]): any[] => {
    const result: any = {};

    let tableKey: string | null = null;   // key under which table rows are stored
    let tableHeaders: string[] = [];      // column headers of the current table
    let lastSectionLabel: string | null = null; // last simple-field label with no value (section heading)

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const colA = row[0]?.toString().trim() || '';
        const colB = row[1]?.toString().trim() || '';

        // Section header row (col A starts with #) — reset table context
        if (colA.startsWith('#')) {
            tableKey = null;
            tableHeaders = [];
            lastSectionLabel = null;
            continue;
        }

        // Skip completely empty rows
        if (!colA && !colB) continue;

        // Skip "Option to include additional rows" label-only rows
        if (colA.toLowerCase().includes('option to include') ||
            colA.toLowerCase().includes('additional rows')) {
            continue;
        }

        // Skip if col B is empty
        if (!colB) continue;

        // --- Detect table header row (3+ short non-URL labels across cols B, C, D...) ---
        if (isTableHeaderRow(row)) {
            // Collect column headers from col B onwards, trim trailing empty ones
            tableHeaders = row.slice(1).map((c: any) => c?.toString().trim() || '');
            while (tableHeaders.length > 0 && !tableHeaders[tableHeaders.length - 1]) {
                tableHeaders.pop();
            }

            // Store the table under the last section label (e.g. "Additional Info"),
            // which mapExcelToFormFields will match to the parent dynamic form field.
            // Fall back to colB (first column header) if no section label was seen.
            const key = lastSectionLabel || colB;
            tableKey = key;
            if (!result[key]) {
                result[key] = [];
            }
            continue;
        }

        // --- Table data row (if we're in a table context) ---
        if (tableKey !== null && tableHeaders.length > 0) {
            const rowCols = row.slice(1, tableHeaders.length + 1)
                .map((c: any) => c?.toString().trim() || '');
            const hasAnyValue = rowCols.some(v => v);

            if (hasAnyValue) {
                const rowObj: any = {};
                tableHeaders.forEach((header, idx) => {
                    if (header) rowObj[header] = rowCols[idx] || '';
                });
                result[tableKey].push(rowObj);
                continue;
            } else {
                // Empty row — end table context
                tableKey = null;
                tableHeaders = [];
            }
        }

        // --- Simple field row: col B = field name, col C = value ---
        const fieldName = colB;
        const value = row[2]?.toString().trim() || '';

        // Track section labels (field name with no value in col C) for table key lookup
        if (!value) {
            lastSectionLabel = fieldName;
        }

        // Skip section label rows (field name ends with ':' and no value)
        if (fieldName.endsWith(':') && !value) continue;

        if (result[fieldName] !== undefined) {
            if (!Array.isArray(result[fieldName])) {
                result[fieldName] = [result[fieldName]];
            }
            if (value) result[fieldName].push(value);
        } else {
            result[fieldName] = value;
        }
    }

    return [result];
};

/**
 * Normalize a field name for comparison
 */
export const normalizeFieldName = (name: string): string => {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '') // Remove all special characters and spaces
        .trim();
};

/**
 * Convert a normalized field name to camelCase
 */
export const toCamelCase = (str: string): string => {
    return str
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (letter, index) => {
            return index === 0 ? letter.toLowerCase() : letter.toUpperCase();
        })
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Get all field keys from the form configuration (including nested dynamic fields)
 * Top-level fields take priority over dynamic sub-fields when keys collide.
 * Parent dynamic fields (type='dynamic') are NOT added to the map — they are only
 * populated via the table-detection fallback in mapExcelToFormFields.
 */
export const getAllFormFieldKeys = (formConfig: FieldConfig[]): Map<string, FieldConfig> => {
    const fieldMap = new Map<string, FieldConfig>();

    // First pass: add dynamic sub-fields (lower priority)
    formConfig.forEach(field => {
        if (field.dynamicFields) {
            field.dynamicFields.forEach(dynamicField => {
                const compositeKey = `${field.key}.${dynamicField.key}`;
                const dynamicEntry = {
                    ...dynamicField,
                    key: compositeKey,
                    parentKey: field.key
                } as any;
                // Only set if not already in map (top-level fields added later will overwrite)
                if (!fieldMap.has(normalizeFieldName(dynamicField.key))) {
                    fieldMap.set(normalizeFieldName(dynamicField.key), dynamicEntry);
                }
                if (!fieldMap.has(normalizeFieldName(dynamicField.label))) {
                    fieldMap.set(normalizeFieldName(dynamicField.label), dynamicEntry);
                }
            });
        }
    });

    // Second pass: add top-level NON-dynamic fields (higher priority)
    // Skip parent dynamic fields — they expect arrays and must not match simple string values
    formConfig.forEach(field => {
        if (field.dynamicFields && field.dynamicFields.length > 0) {
            return; // skip parent dynamic fields
        }
        fieldMap.set(normalizeFieldName(field.key), field);
        fieldMap.set(normalizeFieldName(field.label), field);
    });

    return fieldMap;
};

/**
 * Strip parenthetical notes and extra descriptors from an Excel header.
 * e.g. "Molecular Weight (drop down for units)" -> "Molecular Weight"
 * e.g. "First Approval Date (drop down for calendar, Date/3letter month/YYYY)" -> "First Approval Date"
 */
const cleanExcelHeader = (header: string): string => {
    return header
        .replace(/\s*\(.*?\)/g, '')   // Remove anything in parentheses
        .replace(/\s*\[.*?\]/g, '')   // Remove anything in square brackets
        .replace(/\s*(drop down|dropdown|calendar|free.?text).*$/i, '') // Remove trailing descriptors
        .trim();
};

/**
 * Find the best matching field for a given Excel header using multiple strategies.
 */
const findBestMatch = (header: string, fieldMap: Map<string, FieldConfig>): FieldConfig | undefined => {
    // Strategy 1: exact normalized match
    const normalized = normalizeFieldName(header);
    if (fieldMap.has(normalized)) return fieldMap.get(normalized);

    // Strategy 2: match after stripping parenthetical notes like "(drop down for...)"
    const cleaned = cleanExcelHeader(header);
    const normalizedCleaned = normalizeFieldName(cleaned);
    if (normalizedCleaned && fieldMap.has(normalizedCleaned)) return fieldMap.get(normalizedCleaned);

    return undefined;
};

/**
 * Map Excel data to form fields intelligently
 */
export const mapExcelToFormFields = (
    excelData: any[],
    allFormConfigs: FieldConfig[][]
): MappingResult => {
    if (!excelData || excelData.length === 0) {
        return {
            mappedData: {},
            unmappedFields: [],
            mappingDetails: []
        };
    }

    // Flatten all form configs from all steps
    const flatFormConfig = allFormConfigs.flat();
    const fieldMap = getAllFormFieldKeys(flatFormConfig);

    const firstRow = excelData[0];
    const excelHeaders = Object.keys(firstRow);

    const mappedData: any = {};
    const unmappedFields: string[] = [];
    const mappingDetails: Array<{ excelHeader: string; formField: string | null }> = [];
    const dynamicFieldData: { [parentKey: string]: any[] } = {};

    // Process each Excel column
    excelHeaders.forEach(header => {
        const matchedField = findBestMatch(header, fieldMap);

        if (matchedField) {
            const fieldKey = matchedField.key;

            // Check if this is a dynamic field
            if ((matchedField as any).parentKey) {
                const parentKey = (matchedField as any).parentKey;
                const childKey = fieldKey.split('.')[1];

                // Initialize parent array if not exists
                if (!dynamicFieldData[parentKey]) {
                    dynamicFieldData[parentKey] = [];
                }

                // Process each row for this dynamic field
                excelData.forEach((row, index) => {
                    if (!dynamicFieldData[parentKey][index]) {
                        dynamicFieldData[parentKey][index] = {};
                    }
                    dynamicFieldData[parentKey][index][childKey] = row[header];
                });

                mappingDetails.push({ excelHeader: header, formField: fieldKey });
            } else {
                // Regular field - take value from first row
                const value = firstRow[header];
                // If value is an array of objects (table rows from a dynamic/table field), keep as array
                // and normalize each row's keys to match the form's dynamic field keys
                if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
                    // Build a sub-field map for this parent field's dynamic fields
                    const parentField = matchedField;
                    const subFieldMap = new Map<string, string>(); // normalized label → field key
                    if (parentField.dynamicFields) {
                        parentField.dynamicFields.forEach(df => {
                            subFieldMap.set(normalizeFieldName(df.label), df.key);
                            subFieldMap.set(normalizeFieldName(df.key), df.key);
                        });
                    }
                    // Normalize each row's keys
                    mappedData[fieldKey] = value.map((row: any) => {
                        const normalized: any = {};
                        Object.keys(row).forEach(colHeader => {
                            const normHeader = normalizeFieldName(colHeader);
                            const cleanedHeader = normalizeFieldName(cleanExcelHeader(colHeader));
                            const targetKey = subFieldMap.get(normHeader) ||
                                subFieldMap.get(cleanedHeader) ||
                                toCamelCase(colHeader);
                            normalized[targetKey] = row[colHeader];
                        });
                        return normalized;
                    });
                } else {
                    mappedData[fieldKey] = Array.isArray(value) ? value.join(', ') : value;
                }
                mappingDetails.push({ excelHeader: header, formField: fieldKey });
            }
        } else {
            unmappedFields.push(header);
            mappingDetails.push({ excelHeader: header, formField: null });
        }
    });

    // --- Fallback pass: match unmatched array-of-objects values to parent dynamic fields ---
    // This handles the case where the Excel table key (e.g. "Drug Name") doesn't directly
    // match the form field label (e.g. "Additional Info"), but the table's column headers
    // match the parent field's dynamic sub-fields.
    const unmappedTableHeaders = excelHeaders.filter(header => {
        const value = firstRow[header];
        return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' &&
            !mappedData[header] && !Object.values(mappedData).includes(value);
    });

    if (unmappedTableHeaders.length > 0) {
        // Build a list of all parent dynamic fields
        const parentDynamicFields = flatFormConfig.filter(f => f.dynamicFields && f.dynamicFields.length > 0);

        unmappedTableHeaders.forEach(header => {
            const tableRows = firstRow[header] as any[];
            if (!tableRows || tableRows.length === 0) return;

            // Get the column headers from the first table row
            const tableColHeaders = Object.keys(tableRows[0]);

            // Score each parent dynamic field by how many sub-field labels match the table columns
            let bestParent: FieldConfig | null = null;
            let bestScore = 0;

            parentDynamicFields.forEach(parentField => {
                if (mappedData[parentField.key]) return; // already populated

                const subFieldNormLabels = new Set(
                    parentField.dynamicFields!.flatMap(df => [
                        normalizeFieldName(df.label),
                        normalizeFieldName(df.key)
                    ])
                );

                let score = 0;
                tableColHeaders.forEach(colHeader => {
                    const normCol = normalizeFieldName(colHeader);
                    const cleanedCol = normalizeFieldName(cleanExcelHeader(colHeader));
                    if (subFieldNormLabels.has(normCol) || subFieldNormLabels.has(cleanedCol)) {
                        score++;
                    }
                });

                if (score > bestScore) {
                    bestScore = score;
                    bestParent = parentField;
                }
            });

            // Accept match if at least 2 columns matched
            if (bestParent && bestScore >= 2) {
                const parentField = bestParent as FieldConfig;
                // Build sub-field map for key normalization
                const subFieldMap = new Map<string, string>();
                parentField.dynamicFields!.forEach(df => {
                    subFieldMap.set(normalizeFieldName(df.label), df.key);
                    subFieldMap.set(normalizeFieldName(df.key), df.key);
                });

                // Normalize each row's keys to match form field keys
                mappedData[parentField.key] = tableRows.map((row: any) => {
                    const normalized: any = {};
                    Object.keys(row).forEach(colHeader => {
                        const normHeader = normalizeFieldName(colHeader);
                        const cleanedHeader = normalizeFieldName(cleanExcelHeader(colHeader));
                        const targetKey = subFieldMap.get(normHeader) ||
                            subFieldMap.get(cleanedHeader) ||
                            toCamelCase(colHeader);
                        normalized[targetKey] = row[colHeader];
                    });
                    return normalized;
                });

                mappingDetails.push({ excelHeader: header, formField: parentField.key });
                // Remove from unmapped list
                const idx = unmappedFields.indexOf(header);
                if (idx !== -1) unmappedFields.splice(idx, 1);
            }
        });
    }

    // Add dynamic field arrays to mapped data
    Object.keys(dynamicFieldData).forEach(parentKey => {
        mappedData[parentKey] = dynamicFieldData[parentKey];
    });

    return {
        mappedData,
        unmappedFields,
        mappingDetails
    };
};

/**
 * Create field configurations for unmapped Excel columns
 */
export const createFieldsFromUnmapped = (
    unmappedHeaders: string[]
): FieldConfig[] => {
    return unmappedHeaders.map(header => ({
        key: toCamelCase(header),
        label: header,
        type: 'text',
        required: false,
        placeholder: `Enter ${header}`,
    }));
};

/**
 * Validate Excel file before processing
 */
export const validateExcelFile = (file: File): { valid: boolean; error?: string } => {
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExtension) {
        return {
            valid: false,
            error: 'Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV file.'
        };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        return {
            valid: false,
            error: 'File size exceeds 10MB. Please upload a smaller file.'
        };
    }

    return { valid: true };
};
