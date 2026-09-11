/**
 * Reusable form utilities for ChemBank2
 */

export const formatDateForInput = (val: any): string => {
    if (!val || val === "No data available" || val === "N/A") return "";
    let dateObj: Date | null = null;
    if (typeof val === 'number') {
        dateObj = val > 4102444800 ? new Date(val) : new Date(val * 1000);
    } else if (typeof val === 'string') {
        const str = val.trim();
        if (!str || str === "No data available" || str === "N/A") return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str; // Already YYYY-MM-DD
        if (/^\d{4}$/.test(str)) return `${str}-01-01`; // Year only -> YYYY-01-01

        const dmyMatch = str.match(/^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$/);
        if (dmyMatch) {
            const p1 = parseInt(dmyMatch[1], 10);
            const p2 = parseInt(dmyMatch[2], 10);
            const yr = parseInt(dmyMatch[3], 10);
            if (p1 > 12) {
                const month = String(p2).padStart(2, '0');
                const day = String(p1).padStart(2, '0');
                return `${yr}-${month}-${day}`;
            }
        }

        if (/^\d+$/.test(str)) {
            const num = parseInt(str, 10);
            dateObj = num > 4102444800 ? new Date(num) : new Date(num * 1000);
        } else {
            dateObj = new Date(str);
        }
    } else if (val instanceof Date) {
        dateObj = val;
    }

    if (dateObj && !isNaN(dateObj.getTime())) {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    return String(val);
};

export const isValueFilled = (f: any, val: any): boolean => {
    if (!f || f.type === "header") return false;
    if (val === undefined || val === null) return false;
    
    if (f.type === "dynamic" || Array.isArray(val)) {
        if (Array.isArray(val)) {
            return val.length > 0 && val.some((item) => {
                if (typeof item === "string") return item.trim() !== "";
                if (typeof item === "object" && item !== null) {
                    return Object.values(item).some(v => v !== undefined && v !== null && String(v).trim() !== "");
                }
                return Boolean(item);
            });
        }
        if (typeof val === "object") return Object.keys(val).length > 0;
        return String(val).trim() !== "";
    }
    if (f.type === "file") {
        if (Array.isArray(val)) return val.length > 0;
        if (typeof val === "string") return val.trim() !== "";
        if (typeof val === "object") return Object.keys(val).length > 0;
        return false;
    }
    const str = String(val).trim();
    return str !== "" && str !== "N/A" && str !== "No data available";
};

export const extractSources = (srcData: any): any[] => {
    const raw = srcData?.sources ?? srcData;
    if (Array.isArray(raw)) {
        return raw.map((item: any) => typeof item === 'string' ? { source: item } : item);
    }
    if (typeof raw === 'string' && raw.trim()) {
        return raw.split('\n').filter(s => s.trim()).map(s => ({ source: s.trim() }));
    }
    if (typeof raw === 'object' && raw !== null) {
        return [raw];
    }
    return [];
};

export const extractGlossary = (glossaryData: any): { term: string; definition: string }[] => {
    const raw = glossaryData?.glossary ?? glossaryData;
    if (Array.isArray(raw)) {
        const result: { term: string; definition: string }[] = [];
        for (let i = 0; i < raw.length; i++) {
            const item = raw[i];
            if (typeof item === 'object' && item !== null) {
                const term = (item.term ?? item.Term ?? item.key ?? item.Key ?? '').toString().trim();
                const def = (item.definition ?? item.Definition ?? item.value ?? item.Value ?? '').toString().trim();

                // Check if term is literal generic word "Term" or "Key" or empty
                if (term.toLowerCase() === 'term' || term.toLowerCase() === 'key' || !term) {
                    if (def.includes('\t')) {
                        const [t, ...rest] = def.split('\t');
                        result.push({ term: t.trim(), definition: rest.join('\t').trim() });
                        continue;
                    }
                    if (def.includes(' - ')) {
                        const [t, ...rest] = def.split(' - ');
                        result.push({ term: t.trim(), definition: rest.join(' - ').trim() });
                        continue;
                    }
                    const parenMatch = def.match(/^([^(]+)\(([^)]+)\)$/);
                    if (parenMatch) {
                        result.push({ term: parenMatch[1].trim(), definition: parenMatch[2].trim() });
                        continue;
                    }

                    // Check if current def is abbreviation and next item is its explanation
                    if (i + 1 < raw.length && typeof raw[i + 1] === 'object' && raw[i + 1] !== null) {
                        const nextTerm = (raw[i + 1].term ?? raw[i + 1].Term ?? '').toString().trim();
                        const nextDef = (raw[i + 1].definition ?? raw[i + 1].Definition ?? '').toString().trim();
                        if ((nextTerm.toLowerCase() === 'term' || nextTerm.toLowerCase() === 'key' || !nextTerm) && def.length < 30) {
                            result.push({ term: def, definition: nextDef });
                            i++; // Skip paired definition row
                            continue;
                        }
                    }
                    result.push({ term: def, definition: '' });
                } else if (term && def) {
                    result.push({ term, definition: def });
                } else {
                    result.push({ term: term || def, definition: '' });
                }
            } else if (typeof item === 'string') {
                const s = item.trim();
                if (s.includes('\t')) {
                    const [t, ...rest] = s.split('\t');
                    result.push({ term: t.trim(), definition: rest.join('\t').trim() });
                } else if (s.includes(' - ')) {
                    const [t, ...rest] = s.split(' - ');
                    result.push({ term: t.trim(), definition: rest.join(' - ').trim() });
                } else {
                    const parenMatch = s.match(/^([^(]+)\(([^)]+)\)$/);
                    if (parenMatch) {
                        result.push({ term: parenMatch[1].trim(), definition: parenMatch[2].trim() });
                    } else if (i + 1 < raw.length && typeof raw[i + 1] === 'string' && s.length < 30) {
                        result.push({ term: s, definition: String(raw[i + 1]).trim() });
                        i++;
                    } else {
                        result.push({ term: s, definition: '' });
                    }
                }
            }
        }
        return result;
    }
    if (typeof raw === 'string' && raw.trim()) {
        const entries = raw.split(';').map((s: string) => s.trim()).filter(Boolean);
        return entries.map((s: string) => {
            if (s.includes('\t')) {
                const [t, ...rest] = s.split('\t');
                return { term: t.trim(), definition: rest.join('\t').trim() };
            }
            if (s.includes(' - ')) {
                const [t, ...rest] = s.split(' - ');
                return { term: t.trim(), definition: rest.join(' - ').trim() };
            }
            const parenMatch = s.match(/^([^(]+)\(([^)]+)\)$/);
            if (parenMatch) {
                return { term: parenMatch[1].trim(), definition: parenMatch[2].trim() };
            }
            const parts = s.split(/[:\-]/);
            if (parts.length > 1) {
                return { term: parts[0].trim(), definition: parts.slice(1).join('-').trim() };
            }
            return { term: s.trim(), definition: '' };
        });
    }
    if (typeof raw === 'object' && raw !== null) {
        return Object.entries(raw).map(([t, d]) => ({ term: t, definition: String(d) }));
    }
    return [];
};

export const extractAppendices = (appData: any): any[] => {
    const raw = appData?.appendices ?? appData;
    if (Array.isArray(raw)) {
        return raw.map((item: any) => typeof item === 'string' ? { appendix: item } : item);
    }
    if (typeof raw === 'string' && raw.trim()) {
        return [{ appendix: raw.trim() }];
    }
    if (typeof raw === 'object' && raw !== null) {
        return [raw];
    }
    return [];
};

export const getBadgeStyle = (filledCount: number, totalCount: number) => {
    if (totalCount > 0) {
        if (filledCount === totalCount) {
            return {
                headerBg: "bg-[#0e8a67]/10 border-[#0e8a67]/40 text-[#0e8a67]",
                headerCardBg: "bg-[#0e8a67]/10 border-[#0e8a67]/30 text-[#0e8a67]",
                borderClass: "border-[#0e8a67]/40",
                badgeClass: "bg-[#0e8a67] text-white",
            };
        } else if (filledCount > 0) {
            return {
                headerBg: "bg-amber-50 border-amber-300 text-amber-900",
                headerCardBg: "bg-amber-50 border-amber-200 text-amber-900",
                borderClass: "border-amber-300",
                badgeClass: "bg-amber-500 text-white",
            };
        }
    }
    return {
        headerBg: "bg-slate-50/80 border-slate-200 text-slate-800",
        headerCardBg: "bg-slate-50/80 border-slate-200 text-slate-800",
        borderClass: "border-slate-200",
        badgeClass: "bg-slate-100 text-slate-600 border border-slate-200",
    };
};
