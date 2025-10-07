import React from 'react';
import { formatKey } from '../../utils/utils';
import AppendixLink from './AppendixLink';

interface KeyValueTableProps {
  data: Record<string, any>;
  className?: string;
}

const renderValue = (value: any) => {
  if (Array.isArray(value)) {
    return value.map((item, index) => (
      <span key={index}>
        {index > 0 && ', '}
        {renderLink(String(item))}
      </span>
    ));
  }
  return renderLink(String(value));
};

const renderLink = (text: string) => {
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
  const entries = Object.entries(data || {}).filter(
    ([_, value]) => typeof value !== 'object' || Array.isArray(value)
  );

  if (entries.length === 0) {
    return (
      <div className={`border-2 border-sky-400 rounded bg-white max-w-3xl p-4 ${className}`}>
        <p className="text-gray-500 italic">No data available</p>
      </div>
    );
  }

  return (
    <div className={`border-2 border-sky-400 rounded bg-white max-w-3xl ${className}`}>
      <table className="w-full text-sm text-black">
        <tbody>
          {entries.map(([key, value]) => {
            const displayValue = (!value || value.toString().toLowerCase() === 'n/a') 
              ? 'No data available' 
              : value;
            
            return (
              <tr key={key} className="border-b border-blue-100">
                <td className="w-56 p-3 text-black font-semibold">
                  {formatKey(key)}
                </td>
                <td className="py-2 px-4 whitespace-pre-wrap">
                  {displayValue === 'No data available' ? (
                    <span className="text-gray-500 italic">{displayValue}</span>
                  ) : (
                    renderValue(displayValue)
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default KeyValueTable;