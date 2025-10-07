import React from 'react';
import KeyValueTable from '../Compound/KeyValueTable';
import AppendixLink from '../Compound/AppendixLink';
import { renderManufacturingSitesTable } from './renderers/ManufacturingSitesRenderer';
import { renderReferencesList } from './renderers/ReferencesRenderer';
import { renderAppendices } from './renderers/AppendicesRenderer';
import { renderDrugSubstance } from './renderers/DrugSubstanceRenderer';
import { renderDrugProduct } from './renderers/DrugProductRenderer';
import {
  hasContent,
  formatKey
} from './utils';

interface UniversalDataRendererProps {
  data: any;
  title?: string;
  sectionId?: string;
  level?: number; // 0 = main, 1 = subsection, 2 = subsubsection
  maxTableSize?: number; // Max keys for table display
  className?: string;
}

const UniversalDataRenderer: React.FC<UniversalDataRendererProps> = ({
  data,
  title,
  sectionId,
  level = 0,
  maxTableSize = 10,
  className = ''
}) => {
  // Helper functions (moved to utils)

  // Special renderers (moved to separate files)

  // Special renderers (moved to separate files)

  // Helper to check if object should be displayed as table
  const shouldDisplayAsTable = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    const validKeys = Object.entries(obj).filter(([k, v]) => hasContent(v) && !/^\d+$/.test(k));
    return validKeys.length <= maxTableSize && validKeys.length > 0;
  };

  // Helper to check if object has subsections
  const hasSubsections = (obj: any): boolean => {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    const validKeys = Object.entries(obj).filter(([k, v]) => hasContent(v) && !/^\d+$/.test(k));
    return validKeys.length > maxTableSize;
  };

  // Render arrays as lists
  const renderArray = (arr: any[], arrayTitle?: string) => {
    if (!Array.isArray(arr) || arr.length === 0) return null;

    // Special handling for manufacturing sites
    if (arrayTitle === 'Manufacturing Sites' || sectionId === 'section-3-2-1') {
      return renderManufacturingSitesTable(arr);
    }

    // Special handling for references
    if (arrayTitle === 'References' || sectionId === 'section-6') {
      return renderReferencesList(arr);
    }

    return (
      <div className="mb-4">
        {arrayTitle && <h4 className="text-lg font-semibold mb-2">{arrayTitle}</h4>}
        <ul className="list-disc ml-5 space-y-1">
          {arr.map((item, index) => (
            <li key={index} className="text-sm">
              {typeof item === 'object' ? renderObject(item) : renderValue(item)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render primitive values and links
  const renderValue = (value: any) => {
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
      return renderArray(value);
    }

    if (typeof value === 'object') {
      return renderObject(value);
    }

    const strValue = String(value);
    if (strValue.toLowerCase() === 'n/a' || strValue.trim() === '') return null;

    // Check for URLs
    const urlRegex = /^https?:\/\/[^\s]+$/i;
    if (urlRegex.test(strValue.trim())) {
      return (
        <a
          href={strValue.trim()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {strValue}
        </a>
      );
    }

    // Check for appendix references
    return <AppendixLink text={strValue} />;
  };

  // Render objects
  const renderObject = (obj: any, objTitle?: string) => {
    if (!obj || typeof obj !== 'object') return null;

    if (Array.isArray(obj)) {
      return renderArray(obj, objTitle);
    }

    // Special handling for drug substance
    if (sectionId === 'section-3' || objTitle === 'Drug Substance') {
      return renderDrugSubstance(obj);
    }

    // Special handling for drug product
    if (sectionId === 'section-4' || objTitle === 'Drug Product') {
      return renderDrugProduct(obj);
    }

    // Special handling for appendices
    if (sectionId === 'section-5' || objTitle === 'Appendices') {
      return renderAppendices(obj);
    }

    // If it's a small object, display as table
    if (shouldDisplayAsTable(obj)) {
      return (
        <div className="mb-4">
          {objTitle && <h4 className="text-lg font-semibold mb-2">{objTitle}</h4>}
          <KeyValueTable data={obj} />
        </div>
      );
    }

    // If it has subsections, render them
    if (hasSubsections(obj)) {
      const validEntries = Object.entries(obj).filter(([k, v]) => hasContent(v) && !/^\d+$/.test(k));

      return (
        <div className="mb-6">
          {objTitle && <h4 className="text-lg font-semibold mb-3">{objTitle}</h4>}
          <div className="space-y-4">
            {validEntries.map(([key, value], index) => {
              const subsectionId = sectionId ? `${sectionId}-${index + 1}` : undefined;
              const subsectionTitle = formatKey(key);

              return (
                <div key={key} className="border-l-4 border-sky-400 pl-4">
                  <h5
                    id={subsectionId}
                    className="text-md font-semibold mb-2 text-sky-700"
                  >
                    {level === 0 && sectionId && `${sectionId}.${index + 1} `}
                    {subsectionTitle}
                  </h5>
                  <UniversalDataRenderer
                    data={value}
                    sectionId={subsectionId}
                    level={level + 1}
                    maxTableSize={maxTableSize}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return null;
  };

  // Main render logic
  const containerClasses = level === 0
    ? `mb-10 ${className}`
    : `mb-4 ${className}`;

  return (
    <div className={containerClasses}>
      {title && level === 0 && (
        <h1 id={sectionId} className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4">
          {sectionId && `${sectionId.replace('section-', '')}. `}{title}
        </h1>
      )}

      {Array.isArray(data)
        ? renderArray(data, title)
        : hasContent(data)
          ? renderObject(data, title)
          : <p className="text-gray-500 italic">No data available</p>
      }
    </div>
  );
};

export default UniversalDataRenderer;