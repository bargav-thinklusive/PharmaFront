
import { useParams } from 'react-router-dom';
import { toTitleCase, normalizeValue } from '../../utils/utils';
import Summary from './Summary';
import Table from './Table';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useUser } from '../../context/UserContext';

import { KeyValueDisplay, DataTable } from './shared/renderValue';

// --- Helper Components ---

function SubsectionRenderer({ title, data, index }: { title: string; data: any; index: string }) {
    const normalizedTitle = title.toLowerCase();

    if (normalizedTitle.includes('labeling') || normalizedTitle.includes('label')) {
        const images = Array.isArray(data) ? data : [data];
        return (
            <div className="space-y-4" id={`section-${index.replace(/\./g, '-')}`}>
                <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {images.map((item, i) => {
                        const imgSource = item.image || item.url || (typeof item === 'string' ? item : null);
                        if (!imgSource) return null;
                        return (
                            <div key={i} className="border p-2 rounded bg-white shadow-sm">
                                <img src={imgSource} alt={item.title || `Label ${i + 1}`} className="w-full h-auto object-contain cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => window.open(imgSource, '_blank')} />
                                {item.title && <p className="mt-2 text-center text-sm font-medium text-gray-600">{item.title}</p>}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    if (normalizedTitle.includes('appendic')) {
        const items = Array.isArray(data) ? data : [data];
        // The index passed here is already sectionNum.1, so we need to step back
        // to use sectionNum (e.g., 7) as the base for 7.1, 7.2 etc.
        const baseIndex = index.split('.').slice(0, -1).join('.');

        return (
            <div className="space-y-8">
                {items.map((item, i) => {
                    const subIdx = `${baseIndex}.${i + 1}`;
                    const label = typeof item === 'object' ? (item.appendix || item.name || `Appendix ${i + 1}`) : item;
                    const content = typeof item === 'object' ? (item.content || item.appendix) : item;
                    const isContentSameAsLabel = content === label;

                    return (
                        <div key={i} className="space-y-4" id={`section-${subIdx.replace(/\./g, '-')}`}>
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


    if (Array.isArray(data)) {
        if (data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
            return (
                <div className="space-y-4" id={`section-${index.replace(/\./g, '-')}`}>
                    <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
                    <DataTable data={data} />
                </div>
            );
        }
        return (
            <div className="space-y-2" id={`section-${index.replace(/\./g, '-')}`}>
                <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
                <div className="p-2 border border-blue-100 rounded bg-blue-50/30">{data.join(', ')}</div>
            </div>
        );
    }

    return (
        <div className="space-y-4" id={`section-${index.replace(/\./g, '-')}`}>
            <h2 className="text-lg font-bold text-gray-800 border-blue-400 border-b-2 pb-1">{index} {toTitleCase(title)}</h2>
            <SectionContent data={data} sectionIndex={index} />
        </div>
    );
}

function SectionContent({ data, sectionIndex }: { data: any; sectionIndex: string }) {
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

// --- Internal rendering component to avoid duplication ---

function InternalRenderer({ data, sections, startSectionIndex = 1 }: { data: any; sections?: string[]; startSectionIndex?: number }) {
    const topLevelSections = sections || Object.keys(data);

    return (
        <div className="space-y-12">
            {topLevelSections.map((sectionKey, index) => {
                const sectionData = data[sectionKey];
                if (!sectionData) return null;
                const currentIndex = `${startSectionIndex + index}`;
                return (
                    <div key={sectionKey} id={`section-${currentIndex}`}>
                        <h1 className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-6">
                            {currentIndex}. {toTitleCase(sectionKey)}
                        </h1>
                        <SectionContent data={sectionData} sectionIndex={currentIndex} />
                    </div>
                );
            })}
        </div>
    );
}

// --- Main component ---

interface ViewDrugProps {
    data?: any;
    sections?: string[];
    startSectionIndex?: number;
}

export default function ViewDrug({ data, sections, startSectionIndex = 1 }: ViewDrugProps) {
    const { cid, version } = useParams();
    const { activeSection, handleNavigate } = useIntersectionObserver();
    const { drugsData } = useUser();

    // Check if cid is present
    const isViewerRoute = cid;

    // Use passed data or fetch if in viewer mode
    let displayData = data;
    let drugToDisplay: any = null;

    if (!data && isViewerRoute) {
        drugToDisplay = drugsData.find((d: any) => d.cid === cid && d.version === parseInt(version || '1'));

        if (drugToDisplay) {
            displayData = Object.keys(drugToDisplay).reduce((acc: any, key) => {
                if (!['_id', 'cid', 'version', 'createdAt', 'updatedAt', 'references'].includes(key)) {
                    acc[key] = drugToDisplay[key];
                }
                return acc;
            }, {});
        }
    }

    // If used as a full page component (in routes)
    if (isViewerRoute && drugToDisplay) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
                <div className='w-full max-w-7xl flex flex-row gap-4'>
                    <div className='flex-1 flex flex-col gap-6 min-w-0 mr-80'>
                        {/* Title and Summary - Section 1 */}
                        <div className='mb-10' id="section-1">
                            <Summary drug={drugToDisplay} sectionId={1} />
                        </div>

                        {/* Dynamic Sections starting from 2 */}
                        <InternalRenderer
                            startSectionIndex={2}
                            data={displayData}
                        />
                    </div>

                    {/* Fixed TOC */}
                    <div className="fixed right-0 top-20 w-80 h-[calc(100vh-12rem)] overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 shadow-lg" style={{ zIndex: 50 }}>
                        <Table
                            drug={drugToDisplay}
                            activeSection={activeSection}
                            onNavigate={handleNavigate}
                        />
                    </div>
                </div>
            </div>
        );
    }

    // If it's a viewer route but no drug found
    if (isViewerRoute && !drugToDisplay) {
        return (
            <div className="p-8 text-center text-red-600 text-xl">
                No data found for this drug with CID {cid}.
            </div>
        );
    }

    // Default: render just the dynamic parts (as sub-component)
    if (!displayData) return null;

    return <InternalRenderer data={displayData} sections={sections} startSectionIndex={startSectionIndex} />;
}
