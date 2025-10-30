import React from 'react';
import KeyValueTable from '../../KeyValueTable';
import ManufacturingSites from '../../ManufacturingSites';
import { formatKey, normalizeValue } from '../../../../utils/utils';
import renderValue from '../../shared/renderValue';

interface DynamicDrugSubstanceProps {
  drugSubstance: any;
  drug: any;
}

const DynamicDrugSubstance: React.FC<DynamicDrugSubstanceProps> = ({ drugSubstance, drug }) => {
  if (!drugSubstance) return null;

  const subsections = Object.entries(drugSubstance).filter(([key]) => key !== 'manufacturingSites');

  return (
    <div className="mb-10">
      <h1 id="section-3" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        3. Drug Substance
      </h1>

      {subsections.map(([key, value], idx) => {
        const sectionNum = idx + 1;
        const sectionId = `section-3-${sectionNum}`;

        // Special handling for common subsections
        if (key === 'physicalAndChemicalProperties') {
          const properties = Object.entries(value as any);
          const solubilityEntry = properties.find(([k]) => k === 'solubility');
          const otherProperties = properties.filter(([k]) => k !== 'solubility');

          // Check if solubility content is long (> 300 characters)
          const solubilityContent = solubilityEntry ? JSON.stringify(solubilityEntry[1]) : '';
          const isSolubilityLong = solubilityContent.length > 300;

          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
                3.{sectionNum}. Physical And Chemical Properties
              </h2>
              <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
                <table className="w-full text-sm text-black">
                  <tbody>
                    {otherProperties.map(([subKey, subValue]) => (
                      <tr key={subKey} className="border-b border-blue-100">
                        <td className="w-56 p-3 text-black font-semibold">
                          {formatKey(subKey)}
                        </td>
                        <td className="py-2 px-4 whitespace-pre-wrap">
                          {renderValue(subValue)}
                        </td>
                      </tr>
                    ))}
                    {!isSolubilityLong && solubilityEntry && (
                      <tr className="border-b border-blue-100">
                        <td className="w-56 p-3 text-black font-semibold">
                          {formatKey(solubilityEntry[0])}
                        </td>
                        <td className="py-2 px-4 whitespace-pre-wrap">
                          {renderValue(solubilityEntry[1])}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {isSolubilityLong && solubilityEntry && (
                <div className="mt-6">
                  <h3 id={`section-3-${sectionNum}-1`} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-4">3.{sectionNum}.1 Solubility</h3>
                  <div className="max-w-3xl">
                    {Object.entries(solubilityEntry[1] as any).map(([key, val], idx) => (
                      <div key={idx} className={`mb-4 ${drug.cid === "D002" && (key === "Cefepime" || key === "Enmetazobactam") ? "border-b-2 border-gray-300 pb-4" : ""}`}>
                        <h4 className="font-semibold text-blue-600 mb-2 border-b-2 border-blue-400 pb-2">{formatKey(key)}</h4>
                        {typeof val === 'object' && val !== null ? (
                          <div className="ml-4">
                            {Object.entries(val as any).map(([subKey, subVal], subIdx) => (
                              <div key={subIdx} className="mb-2">
                                <strong className="text-gray-700">{formatKey(subKey)}:</strong> {typeof subVal === 'string' ? renderValue(subVal) : renderValue(subVal)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          renderValue(val)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        if (key === 'processDevelopment') {
          const processData = Object.entries(value as any);
          const manufacturingRouteEntry = processData.find(([k]) => k === 'manufacturingRoute');
          const otherEntries = processData.filter(([k]) => k !== 'manufacturingRoute' && k !== 'manufacturingSites');

          // Convert manufacturingSites object to array if needed
          let sitesArray = null;
          const sites = (value as any).manufacturingSites;
          if (sites) {
            if (Array.isArray(sites)) {
              sitesArray = sites;
            } else if (typeof sites === 'object') {
              // Convert object to array format
              sitesArray = Object.entries(sites).flatMap(([compound, siteData]: any) => {
                // If siteData is an array of objects
                if (Array.isArray(siteData)) {
                  return siteData.map((item: any) => ({
                    vendor: String(item.vendor || item.name || compound),
                    location: String(item.location || ''),
                    compound: compound // Add compound name for grouping
                  }));
                }
                // If siteData is a string (e.g., "Pfizer, Groton, CT")
                if (typeof siteData === 'string') {
                  return [{ vendor: String(siteData), location: '', compound: compound }];
                }
                // If siteData is an object with vendor/location
                return [{
                  vendor: String(siteData.vendor || siteData.name || compound),
                  location: String(siteData.location || ''),
                  compound: compound
                }];
              });
            }
          }

          // Check if manufacturing route content is long (> 500 characters)
          const routeContent = manufacturingRouteEntry ? JSON.stringify(manufacturingRouteEntry[1]) : '';
          const isRouteLong = routeContent.length > 500;

          const tableData = Object.fromEntries(otherEntries);

          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
                3.{sectionNum}. Process Development
              </h2>
              <KeyValueTable data={tableData} />
              {manufacturingRouteEntry && (
                <div className="mt-6">
                  <h3 id={`section-3-${sectionNum}-1`} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-4">3.{sectionNum}.1 Manufacturing Route</h3>
                  <div className="max-w-3xl">
                    {isRouteLong ? (
                      Object.entries(manufacturingRouteEntry[1] as any).map(([routeKey, routeVal]: [string, any], idx) => (
                        <div key={idx} className="mb-6">
                          <h4 className="font-semibold text-blue-600 mb-2 border-b-2 border-gray-300 pb-2">
                            {formatKey(routeKey)}: {routeVal.name || ''}
                          </h4>
                          {routeVal.description && (
                            <p className="mb-2">{routeVal.description}</p>
                          )}
                          {routeVal.synthesisDetails && (
                            <div className="mb-2">
                              <strong>Synthesis Details:</strong> {routeVal.synthesisDetails}
                            </div>
                          )}
                          {routeVal.steps && (
                            <div className="mb-2">
                              <strong>Steps:</strong>
                              <ol className="list-decimal list-inside ml-4">
                                {routeVal.steps.map((step: any, stepIdx: number) => (
                                  <li key={stepIdx} className="mb-1">{step.description || step.step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                          {routeVal.note && (
                            <div className="mb-2">
                              <strong>Note:</strong> {routeVal.note}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      renderValue(manufacturingRouteEntry[1])
                    )}
                  </div>
                </div>
              )}
              {sitesArray && sitesArray.length > 0 && (
                <ManufacturingSites manufacturingSites={sitesArray} />
              )}
            </div>
          );
        }

        if (key === 'analyticalDevelopment') {
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
                3.{sectionNum}. Analytical Development
              </h2>
              {Object.entries(value as any).map(([subKey, subValue], subIdx) => (
                <div key={subKey} className="mb-4 ml-10">
                  <h3 id={`section-3-${sectionNum}-${subIdx + 1}`} className="font-bold border-blue-400 border-b-2 pb-1">
                    3.{sectionNum}.{subIdx + 1} {formatKey(subKey)}
                  </h3>
                  <p>{renderValue(subValue)}</p>
                </div>
              ))}
            </div>
          );
        }

        // Generic subsection rendering
        return (
          <div key={key} className="mb-6 ml-6">
            <h2 id={sectionId} className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
              3.{sectionNum}. {formatKey(key)}
            </h2>
            {typeof value === 'object' && !Array.isArray(value) ? (
              <KeyValueTable data={value as any} />
            ) : (
              <p>{renderValue(normalizeValue(value))}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicDrugSubstance;