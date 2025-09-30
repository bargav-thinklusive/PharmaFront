import React from 'react';
import { formatKey } from '../../utils/formatKey';

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
  return text;
};

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data, className = '' }) => {
  console.log("data",data)
  const filteredData = Object.entries(data || {}).filter(
    ([_, value]) => value && value.toString().toLowerCase() !== 'n/a' && (typeof value !== 'object' || Array.isArray(value))
  );

  if (filteredData.length === 0) return null;
console.log("filter",filteredData);
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