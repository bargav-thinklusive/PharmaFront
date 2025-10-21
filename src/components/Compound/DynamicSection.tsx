import React from 'react';
import { normalizeValue, formatKey, toTitleCase } from '../../utils/utils';

interface DynamicSectionProps {
  data: any;
  sectionType: 'references' | 'appendices' | 'marketInformation' | 'drugSubstance' | 'drugProduct';
  title?: string;
}

const DynamicSection: React.FC<DynamicSectionProps> = ({ data, sectionType, title }) => {
  const renderReferences = (references: any[]) => {
    if (!references || !Array.isArray(references)) return null;

    return (
      <div className="mb-10">
        <h1 id="section-6" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
          {title || '6. References'}
        </h1>
        {(references || []).map((ref: any, refIndex: number) => (
          <div key={refIndex} className="mb-2">
            <h2 id={`section-6-${refIndex + 1}`} className={`font-semibold ${normalizeValue(ref.title) === "No data available" ? "text-gray-500 italic" : ""}`}>
              {refIndex + 1}. {normalizeValue(ref.title)}
            </h2>
            <a
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-blue-600 underline hover:text-blue-800 break-words ${normalizeValue(ref.url) === "No data available" ? "text-gray-500 italic no-underline" : ""}`}
            >
              {normalizeValue(ref.url)}
            </a>
          </div>
        ))}
      </div>
    );
  };

  const renderAppendices = (appendices: any) => {
    if (!appendices) return null;

    const appendixKeys = Object.keys(appendices).filter(key => key.startsWith('appendix'));

    return (
      <div className="mb-10">
        <h1 className="text-2xl font-bold mb-6">{title || 'Appendices'}</h1>
        {appendixKeys.map((appendixKey, appIndex) => {
          const appendix = appendices[appendixKey];
          if (!appendix) return null;

          return (
            <section
              key={appendixKey}
              id={`appendix-${appIndex + 1}`}
              className="mb-6 p-4 border rounded border-gray-300"
            >
              <h3 className="text-lg font-semibold mb-2">
                {appendix.name || appendix.title || `Appendix ${appIndex + 1}`}
              </h3>
              {appendix.reference && (
                <p className="mb-2">
                  <strong>Reference:</strong>{' '}
                  <a
                    href={appendix.reference}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    {appendix.reference}
                  </a>
                </p>
              )}
              {renderAppendixContent(appendix)}
            </section>
          );
        })}
      </div>
    );
  };

  const renderAppendixContent = (appendix: any) => {
    const content: React.ReactElement[] = [];

    // Handle description
    if (appendix.description) {
      content.push(
        <div key="description" className="mb-4">
          <p className="text-gray-700">{normalizeValue(appendix.description)}</p>
        </div>
      );
    }

    // Handle modularSynthesis
    if (appendix.modularSynthesis) {
      content.push(
        <div key="modularSynthesis" className="mb-4">
          <h4 className="font-semibold mb-2">Modular Synthesis</h4>
          {appendix.modularSynthesis.overview && (
            <p className="mb-2 text-gray-700">{normalizeValue(appendix.modularSynthesis.overview)}</p>
          )}
          {appendix.modularSynthesis.steps && renderSteps(appendix.modularSynthesis.steps)}
        </div>
      );
    }

    // Handle synthesisSteps
    if (appendix.synthesisSteps) {
      content.push(
        <div key="synthesisSteps" className="mb-4">
          <h4 className="font-semibold mb-2">Synthesis Steps</h4>
          {renderSteps(appendix.synthesisSteps)}
        </div>
      );
    }

    // Handle preparationSteps
    if (appendix.preparationSteps) {
      content.push(
        <div key="preparationSteps" className="mb-4">
          <h4 className="font-semibold mb-2">Preparation Steps</h4>
          {renderSteps(appendix.preparationSteps)}
        </div>
      );
    }

    // Handle specifications
    if (appendix.specifications) {
      content.push(
        <div key="specifications" className="mb-4">
          <h4 className="font-semibold mb-2">Specifications</h4>
          {renderKeyValueTable(appendix.specifications)}
        </div>
      );
    }

    // Handle inactiveIngredients
    if (appendix.inactiveIngredients) {
      content.push(
        <div key="inactiveIngredients" className="mb-4">
          <h4 className="font-semibold mb-2">Inactive Ingredients</h4>
          {renderIngredientTable(appendix.inactiveIngredients)}
        </div>
      );
    }

    // Handle labels
    if (appendix.labels) {
      content.push(
        <div key="labels" className="mb-4">
          <h4 className="font-semibold mb-2">Labels</h4>
          <ul className="list-disc ml-5">
            {appendix.labels.map((label: any, index: number) => (
              <li key={index}>{normalizeValue(label.label)}</li>
            ))}
          </ul>
        </div>
      );
    }

    // Handle designations
    if (appendix.designations) {
      content.push(
        <div key="designations" className="mb-4">
          <h4 className="font-semibold mb-2">Designations</h4>
          {renderDesignations(appendix.designations)}
        </div>
      );
    }

    // Handle preparationTable
    if (appendix.preparationTable) {
      content.push(
        <div key="preparationTable" className="mb-4">
          <h4 className="font-semibold mb-2">{appendix.preparationTable.title}</h4>
          {renderPreparationTable(appendix.preparationTable)}
        </div>
      );
    }

    // Handle other properties
    const handledKeys = ['name', 'title', 'reference', 'description', 'modularSynthesis', 'synthesisSteps', 'preparationSteps', 'specifications', 'inactiveIngredients', 'labels', 'designations', 'preparationTable'];
    const remainingKeys = Object.keys(appendix).filter(key => !handledKeys.includes(key));

    remainingKeys.forEach((key) => {
      const value = appendix[key];
      if (value && typeof value === 'object') {
        if (Array.isArray(value)) {
          content.push(
            <div key={key} className="mb-4">
              <h4 className="font-semibold mb-2">{toTitleCase(key)}</h4>
              {renderArrayContent(value)}
            </div>
          );
        } else {
          content.push(
            <div key={key} className="mb-4">
              <h4 className="font-semibold mb-2">{toTitleCase(key)}</h4>
              {renderNestedObject(value)}
            </div>
          );
        }
      } else if (value) {
        content.push(
          <div key={key} className="mb-4">
            <h4 className="font-semibold mb-2">{toTitleCase(key)}</h4>
            <p className="text-gray-700">{normalizeValue(value)}</p>
          </div>
        );
      }
    });

    return content.length > 0 ? content : <p className="text-gray-500 italic">No content available</p>;
  };

  const renderSteps = (steps: any[]) => {
    if (!Array.isArray(steps)) return null;

    return (
      <ol className="list-decimal ml-5 space-y-2">
        {steps.map((step, index) => (
          <li key={index} className="text-gray-700">
            {step.name && <strong>{step.name}</strong>}
            {step.title && <strong>{step.title}</strong>}
            {step.step && <strong>Step {step.step}:</strong>}
            {step.instruction && <span>{normalizeValue(step.instruction)}</span>}
            {step.description && <span className="block mt-1">{normalizeValue(step.description)}</span>}
            {step.details && renderStepDetails(step.details)}
            {step.links && renderLinks(step.links)}
          </li>
        ))}
      </ol>
    );
  };

  const renderStepDetails = (details: any) => {
    if (Array.isArray(details)) {
      return (
        <ul className="list-disc ml-5 mt-1">
          {details.map((detail, idx) => (
            <li key={idx} className="text-gray-600">{normalizeValue(detail)}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-gray-600 mt-1">{normalizeValue(details)}</p>;
  };

  const renderLinks = (links: string[]) => {
    if (!Array.isArray(links)) return null;

    return (
      <div className="mt-1">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 block text-sm"
          >
            {link}
          </a>
        ))}
      </div>
    );
  };

  const renderKeyValueTable = (data: Record<string, any>) => {
    const filteredData = Object.entries(data || {}).filter(
      ([_, value]) => typeof value !== 'object' || Array.isArray(value)
    );

    if (filteredData.length === 0) return null;

    return (
      <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
        <table className="w-full text-sm text-black">
          <tbody>
            {filteredData.map(([key, value]) => (
              <tr key={key} className="border-b border-blue-100">
                <td className="w-56 p-3 text-black font-semibold border-r border-sky-300">
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

  const renderIngredientTable = (ingredients: any[]) => {
    if (!Array.isArray(ingredients)) return null;

    return (
      <div className="border-2 border-sky-400 rounded bg-white max-w-4xl overflow-x-auto">
        <table className="w-full text-sm text-black">
          <thead className="bg-sky-50">
            <tr>
              <th className="p-3 text-left font-semibold border-b border-sky-200 border-r border-sky-300">Ingredient Name</th>
              <th className="p-3 text-left font-semibold border-b border-sky-200">Strength</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient, index) => (
              <tr key={index} className="border-b border-blue-100">
                <td className="py-2 px-4">{normalizeValue(ingredient.ingredientName)}</td>
                <td className="py-2 px-4">{normalizeValue(ingredient.strength)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderDesignations = (designations: Record<string, any>) => {
    return Object.entries(designations).map(([key, value]) => (
      <div key={key} className="mb-4">
        <h5 className="font-medium mb-2">{toTitleCase(key)}</h5>
        {Array.isArray(value) ? (
          <ul className="list-disc ml-5">
            {value.map((item, idx) => (
              <li key={idx} className="text-gray-700">{normalizeValue(item)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">{normalizeValue(value)}</p>
        )}
      </div>
    ));
  };

  const renderPreparationTable = (tableData: any) => {
    if (!tableData.doses || !Array.isArray(tableData.doses)) return null;

    return (
      <div className="border-2 border-sky-400 rounded bg-white max-w-4xl overflow-x-auto">
        <table className="w-full text-sm text-black">
          <thead className="bg-sky-50">
            <tr>
              <th className="p-3 text-left font-semibold border-b border-sky-200 border-r border-sky-300">Dose</th>
              <th className="p-3 text-left font-semibold border-b border-sky-200 border-r border-sky-300">Number of Vials</th>
              <th className="p-3 text-left font-semibold border-b border-sky-200 border-r border-sky-300">Volume to Withdraw</th>
              <th className="p-3 text-left font-semibold border-b border-sky-200">Infusion Bag Volume</th>
            </tr>
          </thead>
          <tbody>
            {tableData.doses.map((dose: any, index: number) => (
              <tr key={index} className="border-b border-blue-100">
                <td className="py-2 px-4">{normalizeValue(dose.dose)}</td>
                <td className="py-2 px-4">{normalizeValue(dose.numberOfVials)}</td>
                <td className="py-2 px-4">{normalizeValue(dose.volumeToWithdraw)}</td>
                <td className="py-2 px-4">{normalizeValue(dose.infusionBagVolume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderArrayContent = (array: any[]) => {
    return (
      <ul className="list-decimal ml-5 space-y-1">
        {array.map((item, index) => (
          <li key={index} className="text-gray-700">
            {typeof item === 'object' ? renderNestedObject(item) : normalizeValue(item)}
          </li>
        ))}
      </ul>
    );
  };

  const renderNestedObject = (obj: Record<string, any>, level = 0) => {
    if (level >= 3) {
      // For deeper levels, render as points
      return (
        <ul className="list-disc ml-5">
          {Object.entries(obj).map(([key, value]) => (
            <li key={key} className="text-gray-700">
              <strong>{toTitleCase(key)}:</strong> {normalizeValue(value)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className={`ml-${level * 4}`}>
        {Object.entries(obj).map(([key, value]) => {
          if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="mb-2">
                  <h5 className="font-medium">{toTitleCase(key)}</h5>
                  {renderArrayContent(value)}
                </div>
              );
            } else {
              return (
                <div key={key} className="mb-2">
                  <h5 className="font-medium">{toTitleCase(key)}</h5>
                  {renderNestedObject(value, level + 1)}
                </div>
              );
            }
          } else {
            return (
              <div key={key} className="mb-1">
                <strong>{toTitleCase(key)}:</strong> {normalizeValue(value)}
              </div>
            );
          }
        })}
      </div>
    );
  };

  const renderValue = (value: any) => {
    if (Array.isArray(value)) {
      return value.map((item, index) => (
        <span key={index}>
          {index > 0 && ', '}
          {renderLink(normalizeValue(item))}
        </span>
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
    return <span>{text}</span>;
  };

  const renderMarketDrugSection = (sectionData: any) => {
    if (!sectionData) return null;

    const renderSectionContent = (data: any) => {
      const content: React.ReactElement[] = [];

      // First, render simple key-value pairs as table
      const simpleData = Object.entries(data).filter(
        ([_, value]) => typeof value !== 'object' || Array.isArray(value)
      );

      if (simpleData.length > 0) {
        content.push(
          <div key="simple-table" className="mb-6">
            <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
              <table className="w-full text-sm text-black">
                <tbody>
                  {simpleData.map(([key, value]) => (
                    <tr key={key} className="border-b border-blue-100">
                      <td className="w-56 p-3 text-black font-semibold border-r border-sky-300">
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
          </div>
        );
      }

      // Then render complex nested objects
      const complexData = Object.entries(data).filter(
        ([_, value]) => typeof value === 'object' && !Array.isArray(value) && value !== null
      );

      content.push(
        ...complexData.map(([key, value]) => (
          <div key={key} className="mb-6">
            <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 pb-1">
              {toTitleCase(key)}
            </h3>
            {renderNestedObject(value as Record<string, any>)}
          </div>
        ))
      );

      return content;
    };

    return (
      <div className="mb-10">
        <h1 className={`text-2xl font-bold border-b-4 pb-1 mb-4 ${
          sectionType === 'marketInformation' ? 'border-sky-400' :
          sectionType === 'drugSubstance' ? 'border-green-400' :
          'border-purple-400'
        }`}>
          {title || `${sectionType === 'marketInformation' ? '2' : sectionType === 'drugSubstance' ? '3' : sectionType === 'drugProduct' ? '4' : ''}. ${toTitleCase(sectionType)}`}
        </h1>
        {renderSectionContent(sectionData)}
      </div>
    );
  };

  // Main render logic
  switch (sectionType) {
    case 'references':
      return renderReferences(data);
    case 'appendices':
      return renderAppendices(data);
    case 'marketInformation':
    case 'drugSubstance':
    case 'drugProduct':
      return renderMarketDrugSection(data);
    default:
      return <div className="text-gray-500 italic">Unknown section type</div>;
  }
};

export default DynamicSection;