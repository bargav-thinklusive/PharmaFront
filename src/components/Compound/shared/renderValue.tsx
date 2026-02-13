import React from 'react';
import { formatKey, normalizeValue } from '../../../utils/utils';

// --- Shared Helper Components ---

export function AppendixLink({ text }: { text: string }) {
    if (text === "No data available") {
        return <span className="text-gray-500 italic">{text}</span>;
    }

    const handleClick = (appendixText: string) => {
        const num = appendixText.match(/(\d+)/)?.[1];
        if (!num) return;

        // Find the section that contains the Appendix label
        // The subsections are IDs like section-7-1, section-7-2, etc.
        // We look for a heading or div that has "Appendix N" text inside it.
        const sections = document.querySelectorAll('[id^="section-"]');
        let targetId = '';

        for (const section of Array.from(sections)) {
            const h2 = section.querySelector('h2');
            if (h2 && h2.textContent?.includes(`Appendix ${num}`)) {
                targetId = section.id;
                break;
            }
        }

        if (targetId) {
            const element = document.getElementById(targetId);
            if (element) {
                const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - 100;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    };

    const parts = text.split(/(Appendix \d+)/gi);
    return (
        <React.Fragment>
            {parts.map((part, index) => {
                if (/^Appendix \d+$/i.test(part)) {
                    return (
                        <button
                            key={index}
                            onClick={() => handleClick(part)}
                            className="text-blue-600 underline hover:text-blue-800 cursor-pointer bg-transparent border-none p-0 inline font-medium"
                        >
                            {part}
                        </button>
                    );
                }
                return part;
            })}
        </React.Fragment>
    );
}

export function renderLink(text: string) {
    if (text === "No data available") return <span className="text-gray-500 italic">{text}</span>;
    const urlRegex = /^https?:\/\/[^\s]+$/i;
    if (urlRegex.test(text.trim())) {
        return (
            <a href={text.trim()} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">
                {text}
            </a>
        );
    }
    return <AppendixLink text={text} />;
}

export function renderValue(value: any): React.ReactNode {
    if (Array.isArray(value)) {
        if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null && 'vendor' in value[0]) {
            return value.map((item, index) => (
                <span key={index}>
                    {index > 0 && ', '}
                    {item.vendor}
                </span>
            ));
        }
        return value.map((item, index) => (
            <span key={index}>
                {index > 0 && ', '}
                {typeof item === 'object' && item !== null ? JSON.stringify(item) : renderLink(normalizeValue(item))}
            </span>
        ));
    }
    if (typeof value === 'object' && value !== null) {
        return Object.entries(value).map(([k, v], idx) => (
            <div key={idx} className="mb-1">
                <strong>{formatKey(k)}:</strong> {renderValue(v)}
            </div>
        ));
    }
    return renderLink(normalizeValue(value));
}

export function DataTable({ data }: { data: any[] }) {
    if (!data || data.length === 0) return <div>No data available</div>;
    const headers = Object.keys(data[0]);
    return (
        <div className="overflow-x-auto border-2 border-sky-400 rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 border-collapse">
                <thead className="text-xs text-blue-900 uppercase bg-blue-50 border-b-2 border-sky-400">
                    <tr>
                        {headers.map((header, idx) => (
                            <th key={header} className={`px-6 py-3 font-bold ${idx < headers.length - 1 ? 'border-r border-sky-200' : ''}`}>
                                {formatKey(header)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50">
                            {headers.map((header, idx) => (
                                <td key={header} className={`px-6 py-4 whitespace-pre-wrap ${idx < headers.length - 1 ? 'border-r border-sky-100' : ''}`}>
                                    {normalizeValue(row[header])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function KeyValueDisplay({ data, className = '' }: { data: Record<string, any>; className?: string }) {
    const filteredData = Object.entries(data || {});
    if (filteredData.length === 0) return null;

    return (
        <div className={`border-2 border-sky-400 rounded bg-white max-w-3xl ${className}`}>
            <table className="w-full text-sm text-black border-collapse">
                <tbody>
                    {filteredData.map(([key, value]) => (
                        <tr key={key} className="border-b border-blue-100">
                            <td className="w-56 p-3 text-black font-semibold border-r border-sky-200">
                                {formatKey(key)}
                            </td>
                            <td className="py-2 px-4 whitespace-pre-wrap">
                                {renderValue(value)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
