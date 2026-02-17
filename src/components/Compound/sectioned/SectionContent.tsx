import { normalizeValue, toTitleCase } from '../../../utils/utils';
import { KeyValueDisplay, DataTable } from '../shared/renderValue';

interface SectionContentProps {
    data: any;
    sectionIndex: string;
}

/**
 * SubsectionRenderer component to handle specific data types (labels, appendices, tables, etc.)
 */
function SubsectionRenderer({ title, data, index }: { title: string; data: any; index: string }) {
    const normalizedTitle = title.toLowerCase();

    // Image/Label rendering
    if (normalizedTitle.includes('labeling') || normalizedTitle.includes('label')) {
        const images = Array.isArray(data) ? data : [data];
        return (
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">
                    {index} {toTitleCase(title)}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((item, i) => {
                        const imgSource = item.image || item.url || (typeof item === 'string' ? item : null);
                        if (!imgSource) return null;
                        return (
                            <div key={i} className="border p-2 rounded bg-white shadow-sm">
                                <img
                                    src={imgSource}
                                    alt={item.title || `Label ${i + 1}`}
                                    className="w-full h-auto object-contain cursor-pointer hover:scale-[1.02] transition-transform"
                                    onClick={() => window.open(imgSource, '_blank')}
                                />
                                {item.title && <p className="mt-2 text-center text-sm font-medium text-gray-600">{item.title}</p>}
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
    if (typeof data !== 'object' || data === null) return <div>{normalizeValue(data)}</div>;

    const entries = Object.entries(data);
    const simpleFields: Record<string, any> = {};
    const complexFields: [string, any][] = [];

    entries.forEach(([key, value]) => {
        if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
            complexFields.push([key, value]);
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

