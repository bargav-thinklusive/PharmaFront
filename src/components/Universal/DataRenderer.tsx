import React from 'react';
import { formatKey, toTitleCase } from '../../utils/utils';
import AppendixLink from '../Compound/AppendixLink';

interface DataRendererProps {
  data: any;
  className?: string;
  maxTableRows?: number;
}

const DataRenderer: React.FC<DataRendererProps> = ({ 
  data, 
  className = "",
  maxTableRows = 50 
}) => {
  // Helper functions
  const hasContent = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
    return true;
  };

  const isPlainObject = (val: any) =>
    typeof val === "object" && val !== null && !Array.isArray(val);

  const isUrl = (text: string): boolean => {
    const urlRegex = /^https?:\/\/[^\s]+$/i;
    return urlRegex.test(text.trim());
  };

  const isAppendixReference = (text: string): boolean => {
    return /appendix\s+\d+/i.test(text);
  };

  // Render different types of links
  const renderLink = (text: string) => {
    if (isUrl(text)) {
      return (
        <a
          href={text.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 break-all"
        >
          {text}
        </a>
      );
    }
    
    if (isAppendixReference(text)) {
      return <AppendixLink text={text} />;
    }
    
    return <span className="whitespace-pre-wrap">{text}</span>;
  };

  // Render primitive values (strings, numbers, booleans)
  const renderPrimitive = (value: any) => {
    if (typeof value === 'string') {
      return renderLink(value);
    }
    return <span>{String(value)}</span>;
  };

  // Render arrays as lists or tables depending on content
  const renderArray = (arr: any[]) => {
    if (arr.length === 0) return null;

    // Check if array contains objects with similar keys (table-like data)
    const isTableLike = arr.every(item => 
      isPlainObject(item) && Object.keys(item).length > 0
    );

    if (isTableLike && arr.length > 1) {
      // Get all unique keys from all objects
      const allKeys = Array.from(
        new Set(arr.flatMap(item => Object.keys(item)))
      ).filter(key => 
        arr.some(item => hasContent(item[key]))
      );

      if (allKeys.length > 1) {
        return renderObjectTable(arr, allKeys);
      }
    }

    // Render as a list
    return (
      <ul className="list-disc list-inside space-y-1 ml-4">
        {arr.map((item, index) => (
          <li key={index} className="text-gray-700">
            <DataRenderer data={item} />
          </li>
        ))}
      </ul>
    );
  };

  // Render array of objects as a table
  const renderObjectTable = (arr: any[], keys: string[]) => {
    const displayRows = arr.slice(0, maxTableRows);
    const hasMoreRows = arr.length > maxTableRows;

    return (
      <div className="overflow-x-auto">
        <div className="border-2 border-sky-400 rounded bg-white">
          <table className="w-full text-sm text-black">
            <thead className="bg-sky-50">
              <tr>
                {keys.map(key => (
                  <th key={key} className="p-3 text-left font-semibold border-b border-sky-200">
                    {formatKey(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayRows.map((item, index) => (
                <tr key={index} className="border-b border-blue-100 hover:bg-gray-50">
                  {keys.map(key => (
                    <td key={key} className="p-3 whitespace-pre-wrap">
                      <DataRenderer data={item[key]} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {hasMoreRows && (
          <p className="text-sm text-gray-500 mt-2 italic">
            Showing {maxTableRows} of {arr.length} rows
          </p>
        )}
      </div>
    );
  };

  // Render objects as key-value tables
  const renderObject = (obj: Record<string, any>) => {
    const filteredEntries = Object.entries(obj).filter(
      ([key, value]) => !/^\d+$/.test(key) && hasContent(value)
    );

    if (filteredEntries.length === 0) return null;

    // Check if this should be rendered as a simple key-value table
    const isSimpleKeyValue = filteredEntries.every(([_key, value]) =>
      !isPlainObject(value) || Array.isArray(value)
    );

    if (isSimpleKeyValue && filteredEntries.length <= 20) {
      return (
        <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
          <table className="w-full text-sm text-black">
            <tbody>
              {filteredEntries.map(([key, value]) => (
                <tr key={key} className="border-b border-blue-100">
                  <td className="w-56 p-3 text-black font-semibold">
                    {formatKey(key)}
                  </td>
                  <td className="py-2 px-4">
                    <DataRenderer data={value} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    // Render as nested sections for complex objects
    return (
      <div className="space-y-6">
        {filteredEntries.map(([key, value]) => (
          <div key={key} className="border-l-4 border-gray-300 pl-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              {toTitleCase(key)}
            </h4>
            <div className="ml-2">
              <DataRenderer data={value} />
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Main render logic
  if (!hasContent(data)) {
    return null;
  }

  // Handle different data types
  if (Array.isArray(data)) {
    return <div className={className}>{renderArray(data)}</div>;
  }

  if (isPlainObject(data)) {
    return <div className={className}>{renderObject(data)}</div>;
  }

  // Primitive values
  return <div className={className}>{renderPrimitive(data)}</div>;
};

export default DataRenderer;
