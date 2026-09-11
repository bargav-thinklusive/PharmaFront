import { normalizeValue, toTitleCase, formatDraftDate } from '../../../utils/utils';
import { KeyValueDisplay, DataTable, DrugSubstanceSpecificationsTable, renderLink } from '../shared/renderValue';

interface SectionContentProps {
    data: any;
    sectionIndex?: string;
    section?: any;
}

const METADATA_KEYS_TO_SKIP = [
    '_id', 'id', 'original_id', 'cid', 'version', 'references',
    'createdBy', 'createdByEmail', 'created_by', 'updatedBy', 'updatedByEmail',
    'userId', 'user_id'
];

/**
 * Helper to detect if an object matches the ImageObject pattern (has imageData)
 * or contains a nested image property.
 */
const isImageObject = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.imageData === 'string' || typeof obj.url === 'string') return true;
    if (obj.image) {
        if (typeof obj.image === 'string') return true;
        if (typeof obj.image === 'object') {
            if (Array.isArray(obj.image) && obj.image.length > 0) {
                const first = obj.image[0];
                if (first && typeof first === 'object' && (first.imageData || first.url || first.image || first.src)) return true;
            }
            if (obj.image.imageData || obj.image.url) return true;
        }
    }
    return false;
};

const getImgSrc = (item: any): string | null => {
    if (typeof item === 'string') {
        if (item.startsWith('data:image/') || item.startsWith('blob:')) return item;
        if (item.startsWith('http://') || item.startsWith('https://')) return item;
        if (item.startsWith('/uploads/')) return `http://localhost:8000${item}`;
        if (item.startsWith('uploads/')) return `http://localhost:8000/${item}`;
        return item;
    }
    if (!item || typeof item !== 'object') return null;

    let src: any = item.imageData || item.url || item.image || item.src || null;
    if (Array.isArray(src) && src.length > 0) {
        src = src[0];
    }
    if (typeof src === 'object' && src !== null) {
        src = src.imageData || src.url || src.image || src.src || null;
    }
    if (Array.isArray(src) && src.length > 0) {
        src = src[0];
    }

    if (typeof src === 'string') {
        if (src.startsWith('data:image/') || src.startsWith('blob:')) return src;
        if (src.startsWith('http://') || src.startsWith('https://')) return src;
        if (src.startsWith('/uploads/')) return `http://localhost:8000${src}`;
        if (src.startsWith('uploads/')) return `http://localhost:8000/${src}`;
        return src;
    }
    return null;
};

// Helper to extract clean filename or caption from any image structure
const getImageCaption = (item: any): string => {
    if (!item) return '';
    if (typeof item === 'string') {
        const parts = item.split('/');
        return parts[parts.length - 1] || '';
    }
    if (item.fileName || item.name || item.title) return item.fileName || item.name || item.title;
    if (item.image) {
        if (typeof item.image === 'string') {
            const parts = item.image.split('/');
            return parts[parts.length - 1] || '';
        }
        if (typeof item.image === 'object') {
            if (Array.isArray(item.image) && item.image.length > 0) {
                return item.image[0]?.fileName || item.image[0]?.name || item.image[0]?.title || '';
            }
            return item.image.fileName || item.image.name || item.image.title || '';
        }
    }
    return '';
};

/**
 * SubsectionRenderer component to handle specific data types (labels, appendices, tables, etc.)
 */
function SubsectionRenderer({ title, data, index }: { title: string; data: any; index: string }) {
    const normalizedTitle = title.toLowerCase();
    const isSubSection = index.includes('.');

    const renderHeader = () => {
        if (!isSubSection) return null;
        return (
            <h2 className="text-lg font-bold text-slate-800 border-[#0e8a67] border-b-2 pb-1 font-display">
                {index} {toTitleCase(title)}
            </h2>
        );
    };

    // Check if data is an image or contains images
    const isImageField = normalizedTitle.includes('labeling') ||
        normalizedTitle.includes('label') ||
        normalizedTitle.includes('structure') ||
        normalizedTitle.includes('image');

    if (isImageField || isImageObject(data) || (Array.isArray(data) && data.length > 0 && isImageObject(data[0]))) {
        const rawImages = Array.isArray(data) ? data : [data];
        // Flatten list so nested image arrays also get individual cards
        const images: any[] = [];
        rawImages.forEach((item) => {
            if (item && typeof item === 'object' && Array.isArray(item.image)) {
                item.image.forEach((subImg: any) => {
                    images.push({
                        ...subImg,
                        fileName: subImg?.fileName || subImg?.name || item?.fileName || item?.name,
                        title: subImg?.title || item?.title,
                    });
                });
            } else {
                images.push(item);
            }
        });

        return (
            <div className="space-y-4">
                {renderHeader()}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((item, i) => {
                        const imgSource = getImgSrc(item);
                        if (!imgSource) return null;
                        const caption = getImageCaption(item) || `Image ${i + 1}`;
                        return (
                            <div key={i} className="border p-3 rounded-xl bg-white shadow-xs border-slate-200 overflow-hidden flex flex-col items-center">
                                <img
                                    src={imgSource}
                                    alt={caption}
                                    className="max-w-full h-auto max-h-[400px] object-contain cursor-pointer hover:scale-[1.02] transition-transform rounded-lg"
                                    onClick={() => window.open(imgSource, '_blank')}
                                    onError={(e: any) => {
                                        const target = e.target || e.currentTarget;
                                        if (!target) return;
                                        const currentSrc = target.src || '';
                                        if (currentSrc.startsWith('data:image/') || currentSrc.startsWith('blob:')) return;
                                        if (!currentSrc.includes('placehold.co')) {
                                            target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                                        }
                                    }}
                                />
                                {caption && (
                                    <p className="mt-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/70 px-3 py-1 rounded-md max-w-full truncate" title={caption}>
                                        {caption}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Appendix rendering
    if (normalizedTitle.includes('appendic')) {
        const items = Array.isArray(data) ? data : [data];
        const baseIndex = index.split('.').slice(0, -1).join('.');

        if (items.length === 0) {
            return (
                <div className="space-y-4">
                    {renderHeader()}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm italic">No appendices available.</div>
                </div>
            );
        }

        return (
            <div className="space-y-6">
                {renderHeader()}
                <div className="space-y-4">
                    {items.map((item, i) => {
                        const subIdx = baseIndex ? `${baseIndex}.${i + 1}` : `${i + 1}`;
                        let titleText = `Appendix ${i + 1}`;
                        let bodyText = "";

                        if (typeof item === 'string') {
                            bodyText = item;
                        } else if (typeof item === 'object' && item !== null) {
                            if (item.appendix && item.content && item.appendix !== item.content) {
                                titleText = item.appendix;
                                bodyText = item.content;
                            } else {
                                bodyText = item.content || item.appendix || item.name || JSON.stringify(item);
                                if (item.appendix && item.appendix.length < 40 && !item.content) {
                                    titleText = item.appendix;
                                }
                            }
                        } else {
                            bodyText = String(item);
                        }

                        return (
                            <div key={i} className="p-4 border border-emerald-200/60 rounded-xl bg-emerald-50/40 shadow-xs space-y-2">
                                <h3 className="font-bold text-[#0e8a67] text-xs uppercase tracking-wider">
                                    {subIdx}. {titleText}
                                </h3>
                                <div className="text-slate-800 text-sm whitespace-pre-wrap leading-relaxed">
                                    {renderLink(normalizeValue(bodyText))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (normalizedTitle.includes('drugsubstancespecifications') || normalizedTitle.includes('drug substance specifications')) {
        return (
            <div className="space-y-4">
                {renderHeader()}
                <DrugSubstanceSpecificationsTable data={data} />
            </div>
        );
    }

    if (normalizedTitle.includes('manufacturingroutes') || normalizedTitle.includes('manufacturing routes')) {
        const steps = Array.isArray(data) ? data : [data];
        return (
            <div className="space-y-4">
                {renderHeader()}
                <div className="space-y-4">
                    {steps.map((item, i) => (
                        <div key={i} className="p-4 border border-emerald-200/60 rounded-xl bg-emerald-50/40 shadow-xs">
                            <h3 className="font-bold text-[#0e8a67] mb-1 italic">Step {i + 1}</h3>
                            <div className="text-slate-800 text-sm whitespace-pre-wrap">{item.step || (typeof item === 'string' ? item : JSON.stringify(item))}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (normalizedTitle.includes('sources') || normalizedTitle.includes('source')) {
        let items: any[] = [];
        if (Array.isArray(data)) {
            items = data;
        } else if (typeof data === 'string' && data.trim()) {
            items = data.split('\n').filter(s => s.trim()).map(s => ({ source: s.trim() }));
        } else if (typeof data === 'object' && data !== null) {
            items = [data];
        }

        if (items.length === 0) {
            return (
                <div className="space-y-4">
                    {renderHeader()}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm italic">No sources available.</div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {renderHeader()}
                <div className="space-y-4">
                    {items.map((item, i) => {
                        const val = typeof item === 'object' && item !== null ? (item.source || item.url || item.reference || Object.values(item)[0]) : item;
                        return (
                            <div key={i} className="p-4 border border-emerald-200/60 rounded-xl bg-emerald-50/40 shadow-xs">
                                <h3 className="font-bold text-[#0e8a67] mb-1.5 text-xs uppercase tracking-wider">Source {i + 1}</h3>
                                <div className="text-slate-800 text-sm whitespace-pre-wrap">{renderLink(normalizeValue(val))}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (normalizedTitle.includes('glossary')) {
        let items: { term: string; definition: string }[] = [];

        const isGenericLabel = (str: string) => {
            const s = String(str || '').trim().toLowerCase();
            return !s || s === 'term' || s === 'item' || s === 'key' || s === 'name' || s.startsWith('term ') || s.startsWith('item ');
        };

        const parseSingleString = (s: string): { term: string; definition: string } | null => {
            if (!s || !s.trim()) return null;
            const str = s.trim();
            const parenMatch = str.match(/^([^(]+)\(([^)]+)\)$/);
            if (parenMatch && parenMatch[1].trim() && parenMatch[2].trim()) {
                return { term: parenMatch[1].trim(), definition: parenMatch[2].trim() };
            }
            if (str.includes(':')) {
                const idx = str.indexOf(':');
                const t = str.slice(0, idx).trim();
                const d = str.slice(idx + 1).trim();
                if (t && d && !isGenericLabel(t)) {
                    return { term: t, definition: d };
                }
            }
            if (str.includes(' - ')) {
                const idx = str.indexOf(' - ');
                const t = str.slice(0, idx).trim();
                const d = str.slice(idx + 3).trim();
                if (t && d && !isGenericLabel(t)) {
                    return { term: t, definition: d };
                }
            }
            return null;
        };

        let rawUnits: { term: string; definition: string }[] = [];
        if (Array.isArray(data)) {
            for (const item of data) {
                if (typeof item === 'object' && item !== null) {
                    const rawTerm = item.term ?? item.Term ?? item.key ?? item.Key ?? item.name ?? item.Name ?? '';
                    const rawDef = item.definition ?? item.Definition ?? item.value ?? item.Value ?? item.desc ?? item.description ?? '';
                    
                    if (rawTerm && rawDef && !isGenericLabel(String(rawTerm))) {
                        rawUnits.push({ term: String(rawTerm).trim(), definition: String(rawDef).trim() });
                    } else if (rawTerm && isGenericLabel(String(rawTerm)) && rawDef) {
                        rawUnits.push({ term: '', definition: String(rawDef).trim() });
                    } else if (rawTerm && !rawDef) {
                        rawUnits.push({ term: '', definition: String(rawTerm).trim() });
                    } else if (!rawTerm && rawDef) {
                        rawUnits.push({ term: '', definition: String(rawDef).trim() });
                    } else {
                        for (const [k, v] of Object.entries(item)) {
                            if (k !== '_id' && k !== 'id') {
                                if (isGenericLabel(k)) {
                                    rawUnits.push({ term: '', definition: String(v || '').trim() });
                                } else {
                                    rawUnits.push({ term: k.trim(), definition: String(v || '').trim() });
                                }
                            }
                        }
                    }
                } else if (typeof item === 'string' && item.trim()) {
                    const parts = item.split(';').map(p => p.trim()).filter(Boolean);
                    for (const p of parts) {
                        rawUnits.push({ term: '', definition: p });
                    }
                }
            }
        } else if (typeof data === 'string' && data.trim()) {
            const parts = data.split(';').map(p => p.trim()).filter(Boolean);
            for (const p of parts) {
                rawUnits.push({ term: '', definition: p });
            }
        } else if (typeof data === 'object' && data !== null) {
            for (const [k, v] of Object.entries(data)) {
                if (k !== '_id' && k !== 'id') {
                    if (isGenericLabel(k)) {
                        rawUnits.push({ term: '', definition: String(v || '').trim() });
                    } else {
                        rawUnits.push({ term: k.trim(), definition: String(v || '').trim() });
                    }
                }
            }
        }

        const finalItems: { term: string; definition: string }[] = [];
        for (let i = 0; i < rawUnits.length; i++) {
            const unit = rawUnits[i];
            
            if (unit.term && unit.definition) {
                finalItems.push(unit);
                continue;
            }

            const val = (unit.definition || unit.term || '').trim();
            if (!val) continue;

            const parsed = parseSingleString(val);
            if (parsed) {
                finalItems.push(parsed);
                continue;
            }

            if (i + 1 < rawUnits.length) {
                const nextVal = (rawUnits[i + 1].definition || rawUnits[i + 1].term || '').trim();
                const nextParsed = parseSingleString(nextVal);
                if (!rawUnits[i + 1].term && !nextParsed && nextVal) {
                    finalItems.push({ term: val, definition: nextVal });
                    i++;
                    continue;
                }
            }

            finalItems.push({ term: val, definition: '' });
        }

        items = finalItems;

        if (items.length === 0) {
            return (
                <div className="space-y-4">
                    {renderHeader()}
                    <div className="p-4 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 text-sm italic">No glossary items available.</div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {renderHeader()}
                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className="p-4 border border-emerald-200/60 rounded-xl bg-emerald-50/40 shadow-xs hover:border-emerald-300 transition-colors">
                            <div className="flex items-start sm:items-center gap-2.5 flex-wrap">
                                <span className="text-xs font-semibold text-slate-400">{i + 1}.</span>
                                <span className="font-extrabold text-[#0e8a67] text-sm font-display bg-emerald-100/70 text-[#0c7557] px-2.5 py-0.5 rounded-lg border border-emerald-200/80 shadow-2xs">
                                    {item.term}
                                </span>
                                {item.definition && (
                                    <>
                                        <span className="text-slate-400 font-bold hidden sm:inline">-</span>
                                        <span className="text-slate-800 text-sm font-medium leading-relaxed">
                                            {renderLink(normalizeValue(item.definition))}
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Array/Complex object rendering
    if (Array.isArray(data)) {
        if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            return (
                <div className="space-y-4">
                    {renderHeader()}
                    <DataTable data={data} />
                </div>
            );
        }
        return (
            <div className="space-y-2">
                {renderHeader()}
                <div className="p-2 border border-primary/20 rounded bg-primary-light/50">{data.join(', ')}</div>
            </div>
        );
    }

    // Generic object but might contain metadata we want to skip or images
    return (
        <div className="space-y-4">
            {renderHeader()}
            <SectionContent data={data} sectionIndex={index} />
        </div>
    );
}


/**
 * Handles rendering of fields within a section.
 */
export default function SectionContent({ data, sectionIndex, section }: SectionContentProps) {
    const activeSectionIndex = sectionIndex || (section ? String(section.id) : "1");
    if (data === null || data === undefined) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3 opacity-30">📋</div>
                <p className="text-gray-400 text-sm italic">No data available for this section.</p>
            </div>
        );
    }

    let targetData = data;
    const sectionTitleNormalized = (section?.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");

    // Unwrap section wrapper objects (e.g. Sources: { sources: [...] } -> [...])
    if (targetData && typeof targetData === 'object' && !Array.isArray(targetData)) {
        const rawKeys = Object.keys(targetData).filter(k => !METADATA_KEYS_TO_SKIP.includes(k));
        if (rawKeys.length === 1) {
            const singleKey = rawKeys[0];
            const singleKeyNorm = singleKey.toLowerCase().replace(/[^a-z0-9]/g, "");
            const sectionKeyNorm = (section?.key || "").toLowerCase().replace(/[^a-z0-9]/g, "");

            if (
                singleKeyNorm === sectionTitleNormalized ||
                singleKeyNorm === sectionKeyNorm ||
                ['sources', 'glossary', 'appendices', 'executivesummary', 'labelinginformation', 'babestudies', 'genericentrants'].includes(singleKeyNorm)
            ) {
                targetData = targetData[singleKey];
            }
        }
    }

    if (typeof targetData !== 'object' || targetData === null) {
        return (
            <div className="p-4 border border-emerald-200/60 rounded-xl bg-emerald-50/40 text-slate-800 text-sm whitespace-pre-wrap leading-relaxed shadow-xs">
                {renderLink(normalizeValue(targetData))}
            </div>
        );
    }

    if (Array.isArray(targetData)) {
        return (
            <SubsectionRenderer
                title={section?.title || "Content"}
                data={targetData}
                index={activeSectionIndex}
            />
        );
    }

    const entries = Object.entries(targetData);
    const simpleFields: Record<string, any> = {};
    const complexFields: [string, any][] = [];

    entries.forEach(([key, value]) => {
        // Skip metadata fields in the nested views
        if (METADATA_KEYS_TO_SKIP.includes(key)) return;

        if (key === 'drugSubstanceSpecifications') {
            complexFields.push([key, value]);
            return;
        }

        // Format dates cleanly like the view header
        if (['createdAt', 'updatedAt', 'created_at', 'updated_at', 'lastModified'].includes(key)) {
            simpleFields[key] = formatDraftDate(value);
            return;
        }

        if (Array.isArray(value)) {
            complexFields.push([key, value]);
        } else if (typeof value === 'object' && value !== null) {
            // If it's a single ImageObject, treat it as complex to get the Renderer's image handling
            if (isImageObject(value)) {
                complexFields.push([key, value]);
            } else {
                // Check if the object has any nested complex data
                const hasNestedComplex = Object.values(value).some(v => Array.isArray(v) || (typeof v === 'object' && v !== null));
                if (hasNestedComplex) {
                    complexFields.push([key, value]);
                } else {
                    // It's a simple flat object
                    complexFields.push([key, value]);
                }
            }
        } else {
            simpleFields[key] = value;
        }
    });

    // If there is only one complex field and its name matches the section title or subkey (e.g. Sources -> sources), render it directly without duplicating title
    if (complexFields.length === 1 && Object.keys(simpleFields).length === 0) {
        const [singleKey, singleValue] = complexFields[0];
        const keyNormalized = singleKey.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (
            keyNormalized === sectionTitleNormalized ||
            ['sources', 'glossary', 'appendices', 'executivesummary', 'regulatoryinsights', 'genericentrants', 'labelinginformation', 'babestudies'].includes(keyNormalized)
        ) {
            return <SubsectionRenderer title={section?.title || singleKey} data={singleValue} index={activeSectionIndex} />;
        }
    }

    return (
        <div className="space-y-8">
            {Object.keys(simpleFields).length > 0 && <KeyValueDisplay data={simpleFields} />}
            {complexFields.map(([key, value], idx) => (
                <SubsectionRenderer key={key} title={key} data={value} index={`${activeSectionIndex}.${idx + 1}`} />
            ))}
        </div>
    );
}

