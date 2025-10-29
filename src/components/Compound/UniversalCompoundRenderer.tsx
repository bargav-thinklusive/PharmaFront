import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { normalizeValue, formatKey, toTitleCase } from '../../utils/utils';

const UniversalCompoundRenderer: React.FC = () => {
  const { cid, version } = useParams();
  const { drugsData } = useUser();

  // Find the specific drug based on CID and version
  const compoundData = useMemo(() => {
    if (!cid || !drugsData) return null;
    const targetVersion = version ? parseInt(version) : 1; // Default to version 1 if not specified
    return drugsData.find((drug: any) => drug.cid === cid && drug.version === targetVersion);
  }, [cid, version, drugsData]);
  const [activeSection, setActiveSection] = useState<string>('');

  // Standard section order and mapping
  const standardSections = useMemo(() => [
    { key: 'summary', title: 'Summary', order: 1 },
    { key: 'marketInformation', title: 'Market Information', order: 2 },
    { key: 'drugSubstance', title: 'Drug Substance', order: 3 },
    { key: 'drugProduct', title: 'Drug Product', order: 4 },
    { key: 'appendices', title: 'Appendices', order: 5 },
    { key: 'references', title: 'References', order: 6 }
  ], []);

  // Detect available sections from data
  const detectedSections = useMemo(() => {
    const availableSections = [];
    const dataKeys = Object.keys(compoundData || {});

    // Always include summary if we have basic info
    if (compoundData?.marketInformation?.brandName ||
        compoundData?.brandName ||
        compoundData?.cid) {
      availableSections.push({ key: 'summary', title: 'Summary', order: 1 });
    }

    // Add standard sections if they exist
    standardSections.slice(1).forEach(section => {
      if (dataKeys.includes(section.key) || dataKeys.includes(section.key.toLowerCase())) {
        availableSections.push(section);
      }
    });

    // Add any extra top-level keys not in standard sections
    dataKeys.forEach(key => {
      if (!standardSections.find(s => s.key === key) &&
          !['cid', 'version', '_id'].includes(key) &&
          compoundData[key] &&
          typeof compoundData[key] === 'object') {
        availableSections.push({
          key,
          title: toTitleCase(key),
          order: availableSections.length + 1
        });
      }
    });

    return availableSections.sort((a, b) => a.order - b.order);
  }, [compoundData, standardSections]);

  // Generate Table of Contents
  const tableOfContents = useMemo(() => {
    const toc: Array<{id: string, title: string, level: number}> = [];

    detectedSections.forEach(section => {
      const sectionData = compoundData[section.key];
      if (!sectionData) return;

      toc.push({
        id: `section-${section.order}`,
        title: `${section.order}. ${section.title}`,
        level: 1
      });

      // Add subsections for drugSubstance
      if (section.key === 'drugSubstance' && typeof sectionData === 'object') {
        ['physicalAndChemicalProperties', 'processDevelopment', 'analyticalDevelopment'].forEach((subKey, idx) => {
          if (sectionData[subKey]) {
            toc.push({
              id: `section-${section.order}-${idx + 1}`,
              title: `${section.order}.${idx + 1} ${toTitleCase(subKey.replace(/([A-Z])/g, ' $1'))}`,
              level: 2
            });
          }
        });
      }

      // Add subsections for appendices
      if (section.key === 'appendices' && typeof sectionData === 'object') {
        Object.keys(sectionData).forEach((appKey, idx) => {
          if (appKey.startsWith('appendix')) {
            toc.push({
              id: `section-${section.order}-${idx + 1}`,
              title: `${section.order}.${idx + 1} ${sectionData[appKey]?.name || `Appendix ${idx + 1}`}`,
              level: 2
            });
          }
        });
      }
    });

    return toc;
  }, [detectedSections, compoundData]);

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  // Recursive renderer for any data structure
  const renderValue = (value: any, level = 0, sectionNumber = ''): React.ReactNode => {
    if (value === null || value === undefined) return null;

    // Handle images first (before URLs to avoid URL matching)
    if (typeof value === 'string' && value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return (
        <img
          src={value}
          alt="Chemical structure"
          className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
        />
      );
    }

    // Handle URLs
    if (typeof value === 'string' && value.match(/^https?:\/\//)) {
      return (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {value}
        </a>
      );
    }

    // Handle arrays
    if (Array.isArray(value)) {
      if (value.length === 0) return null;

      // Check if array of objects with similar structure
      const isObjectArray = value.every(item => typeof item === 'object' && item !== null);
      if (isObjectArray && value.length > 0) {
        const keys = Object.keys(value[0]);
        const allSameKeys = value.every(item =>
          keys.every(key => key in item)
        );

        if (allSameKeys && keys.length > 0) {
          // Render as table
          return (
            <div className="border-2 border-sky-400 rounded bg-white max-w-4xl overflow-x-auto">
              <table className="w-full text-sm text-black">
                <thead className="bg-sky-50">
                  <tr>
                    {keys.map(key => (
                      <th key={key} className="p-3 text-left font-semibold border-b  border-r border-sky-300">
                        {formatKey(key)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {value.map((item, idx) => (
                    <tr key={idx} className="border-b border-blue-100">
                      {keys.map(key => (
                        <td key={key} className="py-2 px-4">
                          {renderValue(item[key], level + 1)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Render as list
      return (
        <ul className="list-disc ml-5 space-y-1">
          {value.map((item, idx) => (
            <li key={idx} className="text-gray-700">
              {typeof item === 'object' ? renderValue(item, level + 1) : normalizeValue(item)}
            </li>
          ))}
        </ul>
      );
    }

    // Handle objects
    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) return <span className="text-gray-500">{`{}`}</span>;
  
      // For simple objects with few entries, render as table
      const simpleEntries = entries.filter(([_, val]) => typeof val !== 'object' || Array.isArray(val));
      const complexEntries = entries.filter(([_, val]) => typeof val === 'object' && !Array.isArray(val) && val !== null);
  
      const content: React.ReactNode[] = [];
  
      if (simpleEntries.length > 0 && simpleEntries.length <= 8) {
        content.push(
          <div key="simple-table" className="mb-4">
            <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
              <table className="w-full text-sm text-black">
                <tbody>
                  {simpleEntries.map(([key, val]) => (
                    <tr key={key} className="border-b border-blue-100">
                      <td className="w-56 p-3 text-black font-semibold border-r border-sky-300">
                        {formatKey(key)}
                      </td>
                      <td className="py-2 px-4 whitespace-pre-wrap">
                        {renderValue(val, level + 1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      } else if (simpleEntries.length > 0) {
        simpleEntries.forEach(([key, val]) => {
          content.push(
            <div key={key} className="mb-2">
              <strong>{formatKey(key)}:</strong> {renderValue(val, level + 1)}
            </div>
          );
        });
      }
  
      complexEntries.forEach(([key, val], idx) => {
        const subsectionNumber = sectionNumber ? `${sectionNumber}.${idx + 1}` : `${idx + 1}`;
        content.push(
          <div key={key} className="mb-4">
            <h4 className="font-semibold border-b border-gray-200 pb-1 mb-2">
              {subsectionNumber}. {toTitleCase(key)}
            </h4>
            <div className="ml-4">
              {renderValue(val, level + 1, subsectionNumber)}
            </div>
          </div>
        );
      });
  
      // If we have content, return it; otherwise render as key-value pairs
      if (content.length > 0) {
        return content;
      } else {
        // Fallback: render all entries as key-value pairs
        return (
          <div className="space-y-1">
            {entries.map(([key, val]) => (
              <div key={key} className="mb-1">
                <strong>{formatKey(key)}:</strong> {renderValue(val, level + 1)}
              </div>
            ))}
          </div>
        );
      }
    }

    // Handle primitives
    return <span>{normalizeValue(value)}</span>;
  };

  // Render summary section
  const renderSummary = () => {
    const summaryData: Record<string, any> = {};

    // Add core summary fields first
    summaryData['CID'] = compoundData.cid;
    summaryData['Structure'] = compoundData.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure || compoundData.chemical_structure ? (
      <img
        src={compoundData.drugSubstance?.physicalAndChemicalProperties?.chemicalStructure || compoundData.chemical_structure}
        alt={compoundData.marketInformation?.brandName || compoundData.brand_name || "structure"}
        className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
      />
    ) : "N/A";

    // Add all other top-level fields dynamically
    Object.keys(compoundData).forEach(key => {
      if (key !== 'cid' && key !== '_id' && key !== 'drugSubstance' && key !== 'drugProduct' && key !== 'marketInformation' && key !== 'appendices' && key !== 'references' && key !== 'version') {
        summaryData[formatKey(key)] = compoundData[key];
      }
    });

    // Override specific fields with better formatting
    if (compoundData.drugSubstance?.physicalAndChemicalProperties?.elementalFormula || compoundData.elemental_formula) {
      summaryData['Chemical Formula'] = compoundData.drugSubstance?.physicalAndChemicalProperties?.elementalFormula || compoundData.elemental_formula;
    }
    if (compoundData.drugSubstance?.physicalAndChemicalProperties?.molecularWeight || compoundData.molecular_weight) {
      summaryData['Molecular Weight'] = compoundData.drugSubstance?.physicalAndChemicalProperties?.molecularWeight || compoundData.molecular_weight;
    }
    if (compoundData.drugSubstance?.physicalAndChemicalProperties?.structureName || compoundData.iupac_name || compoundData.structure_name) {
      summaryData['Structure Name'] = compoundData.drugSubstance?.physicalAndChemicalProperties?.structureName || compoundData.iupac_name || compoundData.structure_name;
    }

    const validEntries = Object.entries(summaryData).filter(([_, value]) => value);

    if (validEntries.length === 0) return null;

    return (
      <div className="mb-10">
        <h1 id="section-1" className="text-2xl font-bold border-b-4 border-blue-400 pb-1 mb-4">
          1. Summary
        </h1>
        <div className="border-2 border-sky-400 rounded bg-white max-w-4xl overflow-x-auto">
          <table className="w-full text-sm text-black">
            <tbody>
              {validEntries.map(([key, value]) => {
                // Check if value is an object with multiple keys (like chemicalName, molecularWeight, etc.)
                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                  const subKeys = Object.keys(value);
                  if (subKeys.length >= 1) {  // Changed from > 1 to >= 1 to catch single-key objects too
                    return (
                      <tr key={key} className="border-b border-blue-100">
                        <td className="w-56 p-3 text-black font-semibold border-r border-sky-300">
                          {key}
                        </td>
                        <td className="py-2 px-4">
                          <div className={`grid ${subKeys.length === 2 ? 'grid-cols-2' : subKeys.length === 3 ? 'grid-cols-3' : 'grid-cols-4'} gap-4`}>
                            {subKeys.map(subKey => (
                              <div key={subKey} className="text-center">
                                <div className="font-medium text-blue-600">{subKey}</div>
                                <div className="text-sm">{renderValue(value[subKey])}</div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  }
                }

                // Default rendering for non-object values
                return (
                  <tr key={key} className="border-b border-blue-100">
                    <td className="w-56 p-3 text-black font-semibold border-r border-sky-300">
                      {key}
                    </td>
                    <td className="py-2 px-4 whitespace-pre-wrap">
                      {renderValue(value)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Render references section
  const renderReferences = () => {
    const references = compoundData.references;
    if (!references || !Array.isArray(references)) return null;

    return (
      <div className="mb-10">
        <h1 className="text-2xl font-bold border-b-4 border-blue-400 pb-1 mb-4">
          6. References
        </h1>
        {references.map((ref: any, idx: number) => {
          // Use idx for numbering
          const number = idx + 1;
          return (
            <div key={idx} className="mb-2">
              <h2 className="font-semibold">
                {number}. {normalizeValue(ref.title)}
              </h2>
              {ref.url && (
                <a
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 break-words"
                >
                  {normalizeValue(ref.url)}
                </a>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!compoundData) {
    return <div className="text-gray-500 italic">No data available</div>;
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
      <div className='w-full max-w-7xl flex flex-row gap-4'>
        <div className='flex-1 flex flex-col gap-6 min-w-0 mr-80'>
          {/* Render sections */}
          {detectedSections.map(section => {
            if (section.key === 'summary') {
              return <div key={section.key} id={`section-${section.order}`}>{renderSummary()}</div>;
            }

            if (section.key === 'references') {
              return <div key={section.key} id={`section-${section.order}`}>{renderReferences()}</div>;
            }

            const sectionData = compoundData[section.key];
            if (!sectionData) return null;

            return (
              <div key={section.key} id={`section-${section.order}`} className="mb-10">
                <h1 className={`text-2xl font-bold border-b-4 pb-1 mb-4 ${
                  section.order === 2 ? 'border-sky-400' :
                  section.order === 3 ? 'border-green-400' :
                  section.order === 4 ? 'border-purple-400' :
                  'border-blue-400'
                }`}>
                  {section.order}. {section.title}
                </h1>
                {renderValue(sectionData, 0, section.order.toString())}
              </div>
            );
          })}
        </div>

        {/* Table of Contents */}
        <div className="fixed right-0 top-20 w-80 h-[calc(100vh-12rem)] overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 shadow-lg" style={{ zIndex: 50 }}>
          <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
            TABLE OF CONTENTS
          </h3>
          <ul className="space-y-1">
            {tableOfContents.map((item) => (
              <li key={item.id} className={`${item.level === 2 ? 'ml-4' : ''}`}>
                <button
                  onClick={() => scrollToSection(item.id)}
                  className={`text-blue-600 hover:text-blue-800 hover:underline text-left w-full text-sm ${
                    activeSection === item.id ? 'font-bold' : ''
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UniversalCompoundRenderer;