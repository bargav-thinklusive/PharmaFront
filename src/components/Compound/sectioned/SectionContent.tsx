import { normalizeValue, toTitleCase } from '../../../utils/utils';
import { KeyValueDisplay, DataTable } from '../shared/renderValue';

interface SectionContentProps {
    data: any;
    sectionIndex: string;
}

/**
 * Helper to detect if an object matches the ImageObject pattern (has imageData)
 * or contains a nested image property.
 */
const isImageObject = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object') return false;
    if (typeof obj.imageData === 'string' || typeof obj.url === 'string') return true;
    if (obj.image) {
        if (typeof obj.image === 'string') return true;
        if (typeof obj.image === 'object' && (obj.image.imageData || obj.image.url)) return true;
    }
    return false;
};

const getImgSrc = (item: any): string | null => {
    if (typeof item === 'string') return item;
    if (!item || typeof item !== 'object') return null;

    if (typeof item.imageData === 'string') return item.imageData;
    if (typeof item.url === 'string') return item.url;

    if (item.image) {
        if (typeof item.image === 'string') return item.image;
        if (typeof item.image === 'object') return item.image.imageData || item.image.url || null;
    }

    return null;
};

/**
 * SubsectionRenderer component to handle specific data types (labels, appendices, tables, etc.)
 */
function SubsectionRenderer({ title, data, index }: { title: string; data: any; index: string }) {
    const normalizedTitle = title.toLowerCase();

    // Check if data is an image or contains images
    const isImageField = normalizedTitle.includes('labeling') ||
        normalizedTitle.includes('label') ||
        normalizedTitle.includes('structure') ||
        normalizedTitle.includes('image');

    if (isImageField || isImageObject(data) || (Array.isArray(data) && data.length > 0 && isImageObject(data[0]))) {
        const images = Array.isArray(data) ? data : [data];
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">
                    {index} {toTitleCase(title)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((item, i) => {
                        const imgSource = getImgSrc(item);
                        if (!imgSource) return null;
                        return (
                            <div key={i} className="border p-2 rounded bg-white shadow-sm overflow-hidden flex flex-col items-center">
                                <img
                                    src={imgSource}
                                    alt={item.fileName || item.name || item.title || `Image ${i + 1}`}
                                    className="max-w-full h-auto max-h-[400px] object-contain cursor-pointer hover:scale-[1.02] transition-transform"
                                    onClick={() => window.open(imgSource, '_blank')}
                                    onError={(e: any) => {
                                        console.error("Image load failed:", imgSource);
                                        e.target.src = 'https://placehold.co/400x300?text=Image+Not+Found';
                                    }}
                                />
                                {(item.fileName || item.name || item.title) && (
                                    <p className="mt-2 text-center text-sm font-medium text-gray-600">
                                        {item.fileName || item.name || item.title}
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

        return (
            <div className="space-y-8">
                {items.map((item, i) => {
                    const subIdx = `${baseIndex}.${i + 1}`;
                    const label = typeof item === 'object' ? (item.appendix || item.name || `Appendix ${i + 1}`) : item;
                    const content = typeof item === 'object' ? (item.content || item.appendix) : item;
                    const isContentSameAsLabel = content === label;

                    return (
                        <div key={i} className="space-y-4">
                            <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{subIdx} {label}</h2>
                            <div className="p-4 border border-blue-50 rounded bg-blue-50/10 min-h-[100px] text-gray-700 whitespace-pre-wrap">
                                {isContentSameAsLabel ? (
                                    <span className="text-gray-400 italic">No additional content provided for this appendix.</span>
                                ) : (
                                    content
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (normalizedTitle.includes('manufacturingroutes') || normalizedTitle.includes('manufacturing routes')) {
        const steps = Array.isArray(data) ? data : [data];
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
                <div className="space-y-4">
                    {steps.map((item, i) => (
                        <div key={i} className="p-4 border border-blue-100 rounded bg-blue-50/30">
                            <h3 className="font-bold text-blue-900 mb-1 italic">Step {i + 1}</h3>
                            <div className="text-gray-700 whitespace-pre-wrap">{item.step || (typeof item === 'string' ? item : JSON.stringify(item))}</div>
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
                    <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
                    <DataTable data={data} />
                </div>
            );
        }
        return (
            <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
                <div className="p-2 border border-blue-100 rounded bg-blue-50/30">{data.join(', ')}</div>
            </div>
        );
    }

    // Generic object but might contain metadata we want to skip or images
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
            <SectionContent data={data} sectionIndex={index} />
        </div>
    );
}


/**
 * Handles rendering of fields within a section.
 */
export default function SectionContent({ data, sectionIndex }: SectionContentProps) {
    if (data === null || data === undefined) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="text-4xl mb-3 opacity-30">📋</div>
                <p className="text-gray-400 text-sm italic">No data available for this section.</p>
            </div>
        );
    }
    if (typeof data !== 'object') return <div className="text-gray-700 p-2">{normalizeValue(data)}</div>;

    const entries = Object.entries(data);
    const simpleFields: Record<string, any> = {};
    const complexFields: [string, any][] = [];

    entries.forEach(([key, value]) => {
        // Skip metadata fields in the nested views
        if (['_id', 'cid', 'version'].includes(key)) return;

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

    return (
        <div className="space-y-8">
            {Object.keys(simpleFields).length > 0 && <KeyValueDisplay data={simpleFields} />}
            {complexFields.map(([key, value], idx) => (
                <SubsectionRenderer key={key} title={key} data={value} index={`${sectionIndex}.${idx + 1}`} />
            ))}
        </div>
    );
}

