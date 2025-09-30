import React from 'react';
import { formatKey } from '../../utils/formatKey';

interface KeyValueTableProps {
  data: Record<string, any>;
  className?: string;
}

const KeyValueTable: React.FC<KeyValueTableProps> = ({ data, className = '' }) => {
  const filteredData = Object.entries(data || {}).filter(
    ([_, value]) => value && value.toString().toLowerCase() !== 'n/a'
  );

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
                {Array.isArray(value)
                  ? value.join(', ')
                  : typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeyValueTable;