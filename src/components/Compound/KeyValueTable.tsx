import React from 'react';
import { formatKey, normalizeValue } from '../../utils/utils';
import AppendixLink from './sections/Appendices/AppendixLink';

interface KeyValueTableProps {
  data: Record<string, any>;
  className?: string;
}

const renderValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={index}>
        {index > 0 && ', '}
        {typeof item === 'object' && item !== null ? JSON.stringify(item) : renderLink(normalizeValue(item))}
      </span>
    ));
  }
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return Object.entries(value).map(([k, v], idx) => (
      <div key={idx} className="mb-1">
        <strong>{formatKey(k)}:</strong> {renderValue(v)}
      </div>
    ));
  }
  return renderLink(normalizeValue(value));
};

const renderLink = (text: string) => {
  if (text === "No data available") {
    return <span className="text-gray-500 italic">{text}</span>;
  }
  const urlRegex = /^https?:\/\/[^\s]+$/i;
  if (urlRegex.test(text.trim())) {
    return (
      <a
        href={text.trim()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800"
      >
        {text}
      </a>
    );
  }
  return <AppendixLink text={text} />;
};

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data, className = '' }) => {

  const filteredData = Object.entries(data || {});

  if (filteredData.length === 0) return null;

  return (
    <div className={`border-2 border-sky-400 rounded bg-white max-w-3xl ${className}`}>
      <table className="w-full text-sm text-black">
        <tbody>
          {filteredData.map(([key, value]) => (
            <tr key={key} className="border-b border-blue-100">
              <td className="w-56 p-3 text-black font-semibold">
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
};

export default KeyValueTable;