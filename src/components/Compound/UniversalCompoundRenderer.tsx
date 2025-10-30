import React from 'react';
import { useParams } from 'react-router-dom';
import { IoIosLink } from 'react-icons/io';
import Summary from './Summary';
import Table from './Table';
import KeyValueTable from './KeyValueTable';
import ManufacturingSites from './ManufacturingSites';
import AppendixLink from './AppendixLink';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import { useUser } from '../../context/UserContext';
import { formatKey, normalizeValue } from '../../utils/utils';

/**
 * Universal Compound Renderer
 *
 * Follows CompoundInformation structure but works dynamically with any JSON.
 * Uses existing components: KeyValueTable, AppendixLink, ManufacturingSites, etc.
 */

const renderValue = (value: any) => {
  if (typeof value === 'string') {
    // Special handling for chemical structure images
    if (value.includes('.png') || value.includes('.jpg') || value.includes('.jpeg') || value.includes('.gif')) {
      return (
        <img
          src={value}
          alt="Chemical Structure"
          className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg"
        />
      );
    }
    return <AppendixLink text={normalizeValue(value)} />;
  } else if (value && typeof value === 'object') {
    return (
      <div>
        {Object.entries(value).map(([key, val], idx) => (
          <div key={idx} className="mb-4">
            <h4 className="font-semibold text-blue-600 mb-2">{formatKey(key)}</h4>
            {typeof val === 'object' && val !== null ? (
              <div className="ml-4">
                {Object.entries(val).map(([subKey, subVal], subIdx) => (
                  <div key={subIdx} className="mb-2">
                    <strong className="text-gray-700">{formatKey(subKey)}:</strong> {typeof subVal === 'string' ? <AppendixLink text={normalizeValue(subVal)} /> : renderValue(subVal)}
                  </div>
                ))}
              </div>
            ) : (
              <AppendixLink text={normalizeValue(val)} />
            )}
          </div>
        ))}
      </div>
    );
  }
  return <AppendixLink text={normalizeValue(value)} />;
};

// Render Market Information section dynamically
const DynamicMarketInformation: React.FC<{ marketInformation: any }> = ({ marketInformation }) => {
  if (!marketInformation) return null;

  const { specialStatus, ...otherData } = marketInformation;

  // If specialStatus is short (less than 200 characters), include it in the table
  const includeSpecialStatusInTable = specialStatus && specialStatus.length < 200;

  const tableData = includeSpecialStatusInTable
    ? { ...otherData, specialStatus }
    : otherData;

  return (
    <div className="mb-10">
      <h1 id="section-2" className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4">
        2. Market Information
      </h1>
      <KeyValueTable data={tableData} />
      {specialStatus && !includeSpecialStatusInTable && (
        <div className="mt-6">
          <h2 className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-4">Special Status</h2>
          <ul className="list-disc list-inside">
            {specialStatus.split('. ').map((point: string, idx: number) => (
              <li key={idx} className="mb-1">{point.trim()}{point.trim() && !point.trim().endsWith('.') ? '.' : ''}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Render Drug Substance section dynamically
const DynamicDrugSubstance: React.FC<{ drugSubstance: any; drug: any }> = ({ drugSubstance, drug }) => {
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
                        <h4 className="font-semibold text-blue-600 mb-2">{formatKey(key)}</h4>
                        {typeof val === 'object' && val !== null ? (
                          <div className="ml-4">
                            {Object.entries(val as any).map(([subKey, subVal], subIdx) => (
                              <div key={subIdx} className="mb-2">
                                <strong className="text-gray-700">{formatKey(subKey)}:</strong> {typeof subVal === 'string' ? <AppendixLink text={normalizeValue(subVal)} /> : renderValue(subVal)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <AppendixLink text={normalizeValue(val)} />
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
              <p><AppendixLink text={normalizeValue(value)} /></p>
            )}
          </div>
        );
      })}
    </div>
  );
};

// Render Drug Product section dynamically
const DynamicDrugProduct: React.FC<{ drugProduct: any }> = ({ drugProduct }) => {
  if (!drugProduct) return null;

  const renderStrengthsTable = (strengths: any[]) => (
    <table className="table-auto border-collapse border-b border-blue-400 mb-4">
      <thead>
        <tr>
          <th className="border border-gray-400 px-2">Index</th>
          <th className="border border-gray-400 px-2">Type</th>
          <th className="border border-gray-400 px-2">Strength</th>
          <th className="border border-gray-400 px-2">Description</th>
        </tr>
      </thead>
      <tbody>
        {strengths.map((v: any, i: number) => (
          <tr key={i}>
            <td className="border border-gray-400 px-2">{i + 1}</td>
            <td className="border border-gray-400 px-2">{normalizeValue(v.type)}</td>
            <td className="border border-gray-400 px-2">{normalizeValue(v.strength)}</td>
            <td className="border border-gray-400 px-2">{normalizeValue(v.description)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderObjectData = (value: any) => (
    <div>
      {Object.entries(value).map(([k, v], i) => (
        <p key={i}>
          <strong>{formatKey(k)}:</strong> {renderValue(v)}
        </p>
      ))}
    </div>
  );

  const renderArrayData = (value: any[]) => (
    <div>
      {value.map((v: any, i) => <p key={i}>{i + 1}. {renderValue(v)}</p>)}
    </div>
  );

  const information = drugProduct?.information || drugProduct;
  let sectionCounter = 0;

  return (
    <div className="mb-10">
      <h1 id="section-4" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        4. Drug Product
      </h1>
      {Object.entries(information || {}).map(([key, value]) => {
        sectionCounter++;
        const sectionId = `section-4-${sectionCounter}`;

        if (key === "strengths" && Array.isArray(value)) {
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. Strengths
              </h2>
              {renderStrengthsTable(value)}
            </div>
          );
        }

        if (key === "dosingTable") {
          const dosingValue = value as any;
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. Dosing Table
              </h2>
              {dosingValue.description && <p className="mb-4">{dosingValue.description}</p>}
              {dosingValue.notes && dosingValue.notes.length > 0 && (
                <div className="mb-4">
                  <strong>Notes:</strong>
                  <ol className="list-decimal list-inside ml-4">
                    {dosingValue.notes.map((note: string, noteIdx: number) => (
                      <li key={noteIdx} className="mb-1">{note}</li>
                    ))}
                  </ol>
                </div>
              )}
              {dosingValue.regimenByRenalFunction && dosingValue.regimenByRenalFunction.length > 0 && (
                <div className="border-2 border-sky-400 rounded bg-white max-w-4xl">
                  <table className="w-full text-sm text-black">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="p-3 text-black font-semibold text-left">eGFR (mL/min)</th>
                        <th className="p-3 text-black font-semibold text-left">Dose</th>
                        <th className="p-3 text-black font-semibold text-left">Dosing Interval</th>
                        <th className="p-3 text-black font-semibold text-left">Infusion Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dosingValue.regimenByRenalFunction.map((regimen: any, idx: number) => (
                        <tr key={idx} className="border-b border-blue-100">
                          <td className="py-2 px-4">{regimen.eGFR_mL_per_min}</td>
                          <td className="py-2 px-4">{regimen.dose}</td>
                          <td className="py-2 px-4">{regimen.dosingInterval}</td>
                          <td className="py-2 px-4">{regimen.infusionTime}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        }

        if (key === "packagingAndStorageConditions") {
          const packagingValue = value as any;
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. Packaging And Storage Conditions
              </h2>
              <div className="border-2 border-sky-400 rounded bg-white max-w-4xl">
                <table className="w-full text-sm text-black">
                  <thead>
                    <tr className="border-b border-blue-100">
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Strength</th>
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Description</th>
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Packaging</th>
                      <th className="w-1/4 p-3 text-black font-semibold text-left">Storage Temperature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(packagingValue).filter(([k]) => k !== 'description' && k !== 'packaging' && k !== 'ndc' && k !== 'type' && k !== 'storageTemperature').map(([strength, details]: [string, any], idx) => (
                      <tr key={idx} className="border-b border-blue-100">
                        <td className="py-2 px-4 font-semibold">{strength}</td>
                        <td className="py-2 px-4">{details.description || 'N/A'}</td>
                        <td className="py-2 px-4">{details.packaging || 'N/A'}</td>
                        <td className="py-2 px-4">{details.storageTemperature || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        if (typeof value === "object" && !Array.isArray(value)) {
          return (
            <div key={key} className="mb-6 ml-6">
              <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-2">
                4.{sectionCounter}. {formatKey(key)}
              </h2>
              {renderObjectData(value)}
            </div>
          );
        }

        return (
          <div key={key} className="mb-4 ml-6">
            <h2 id={sectionId} className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-1">
              4.{sectionCounter}. {formatKey(key)}
            </h2>
            {Array.isArray(value) ? renderArrayData(value) : <p>{renderValue(value)}</p>}
          </div>
        );
      })}
    </div>
  );
};

// Render Appendices section dynamically
const DynamicAppendices: React.FC<{ appendices: any }> = ({ appendices }) => {
  if (!appendices) return null;

  const appendixKeys = Object.keys(appendices).sort();

  return (
    <div className="mb-10">
      <h1 id="section-5" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        5. Appendices
      </h1>

      {appendixKeys.map((key, appIdx) => {
        const appendix = appendices[key];
        const appNum = appIdx + 1;

        if (key === 'appendix1') {
          return (
            <div key={key}>
              <div className="ml-6">
                <div className="flex flex-row justify-between align-center border-blue-400 border-b-4 mt-4">
                  <h2 id={`section-5-${appNum}`} className="font-semibold">5.{appNum} {appendix.name}</h2>
                  {appendix.reference && (
                    <a
                      href={appendix.reference}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IoIosLink className="cursor-pointer text-blue-600" style={{ color: "black" }} />
                    </a>
                  )}
                </div>
                <p>{appendix.description}</p>
              </div>
              <div className="ml-10">
                <h3 id={`section-5-${appNum}-1`} className="font-semibold border-blue-400 border-b-4 mt-4">5.{appNum}.1 Modular Synthesis</h3>
                <p>{appendix.modularSynthesis.overview}</p>
                <div className="ml-12">
                  {appendix.modularSynthesis?.steps?.map((step: any, index: number) => (
                    <React.Fragment key={index}>
                      <div className="font-semibold border-blue-400 border-b-4 mt-4">
                        <strong>5.{appNum}.1.{index + 1} {step.name}</strong>
                      </div>
                      {step.details.map((detail: string, detailIndex: number) => (
                        <p key={detailIndex}>{detail}</p>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="ml-10">
                <h3 id={`section-5-${appNum}-2`} className="font-semibold border-blue-400 border-b-4 mt-4">5.{appNum}.2 Synthesis Steps</h3>
                <div className="ml-12">
                  {appendix.synthesisSteps?.map((step: any, index: number) => (
                    <div key={index} className="mb-4">
                      <div className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                        5.{appNum}.2.{index + 1}. {step.title}
                      </div>
                      <p>{step.description}</p>
                      <div>
                        {step.links && step.links.map((linkString: string, linkIndex: number) => (
                          linkString.split("https://").filter(Boolean).map((url, i) => (
                            <div key={linkIndex} className="flex items-center justify-start">
                              {linkIndex + 1}.
                              <a
                                key={i}
                                href={`https://${url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 underline hover:text-blue-800 block break-words"
                              >
                                {`https://${url}`}
                              </a>
                            </div>
                          ))
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }

        if (key === 'appendix2') {
          return (
            <div key={key} className="mt-6">
              <div className="ml-6">
                <h2 id={`section-5-${appNum}`} className="flex flex-row justify-between align-center border-blue-400 border-b-4 font-bold mt-4">
                  5.{appNum} {appendix.name}
                </h2>
              </div>
              <div className="ml-10">
                {Object.entries(appendix.specifications).map(
                  ([subKey, value], index) => (
                    <div key={index} className="mb-2">
                      <h3 id={`section-5-${appNum}-${index + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                        5.{appNum}.{index + 1} {formatKey(subKey)}
                      </h3>
                      <p className={normalizeValue(value) === "No data available" ? "text-gray-500 italic" : ""}>{normalizeValue(value)}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        }

        if (key === 'appendix3') {
          return (
            <div key={key} className="mt-6 ml-6">
              <h2 id={`section-5-${appNum}`} className="font-bold border-blue-400 border-b-4 mt-4">5.{appNum} {appendix.name}</h2>
              <p>{appendix.note}</p>
              <div className="ml-10 mt-2">
                <h3 id={`section-5-${appNum}-1`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">5.{appNum}.1 Inactive Ingredients</h3>
                <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 px-4 py-2 text-left">Ingredient Name</th>
                      <th className="border border-gray-400 px-4 py-2 text-left">Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(appendix.inactiveIngredients || []).map((item: any, index: number) => {
                      const { ingredientName, strength } = item;
                      return (
                        <tr key={index}>
                          <td className={`border border-gray-400 px-4 py-2 ${normalizeValue(ingredientName) === "No data available" ? "text-gray-500 italic" : ""}`}>{normalizeValue(ingredientName)}</td>
                          <td className={`border border-gray-400 px-4 py-2 ${normalizeValue(strength) === "No data available" ? "text-gray-500 italic" : ""}`}>{normalizeValue(strength) || '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        if (key === 'appendix4') {
          return (
            <div key={key} className="mt-6 ml-6">
              <h2 id={`section-5-${appNum}`} className="font-bold border-blue-400 border-b-4 mt-4">5.{appNum} {appendix.name}</h2>
              <p>{appendix.description}</p>
              {appendix.preparationSteps && (
                <div className="ml-10 mt-2">
                  <h3 className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">Preparation Steps</h3>
                  <ul className="list-disc list-inside">
                    {appendix.preparationSteps.map((step: string, index: number) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ul>
                </div>
              )}
              {appendix.preparationTable && (
                <div className="ml-10 mt-2">
                  <h3 className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">{appendix.preparationTable.title}</h3>
                  <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-4 py-2 text-left">Dose</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Number of Vials</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Volume to Withdraw</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Infusion Bag Volume</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appendix.preparationTable?.doses?.map((dose: any, index: number) => (
                        <tr key={index}>
                          <td className="border border-gray-400 px-4 py-2">{dose.dose}</td>
                          <td className="border border-gray-400 px-4 py-2">{dose.numberOfVials}</td>
                          <td className="border border-gray-400 px-4 py-2">{dose.volumeToWithdraw}</td>
                          <td className="border border-gray-400 px-4 py-2">{dose.infusionBagVolume}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {appendix.labels && appendix.labels.length > 0 && (
                <ul className="list-disc list-inside">
                  {appendix.labels?.map((item: any, index: number) => (
                    <li key={index}>
                      <p>{item.label}</p>
                      <img src={item.image} alt={item.label} className="w-264 h-64 object-contain my-2 cursor-pointer hover:shadow-lg" />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        }

        if (key === 'appendix5') {
          return (
            <div key={key} className="mt-6 ml-6">
              <div>
                <h2 id={`section-5-${appNum}`} className="font-bold border-blue-400 border-b-4 mt-4">5.{appNum} {appendix.name}</h2>
                <p>{appendix.description}</p>
                <div className="ml-10 mt-2">
                  {Object.entries(appendix.designations || {}).map(([subKey, value], index) => (
                    <div key={index} className="mb-4">
                      <h3 id={`section-5-${appNum}-${index + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                        5.{appNum}.{index + 1} {formatKey(subKey)}
                      </h3>
                      {Array.isArray(value) ? (
                        <ul className="list-disc list-inside">
                          {value.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className={normalizeValue(value) === "No data available" ? "text-gray-500 italic" : ""}>{normalizeValue(value)}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        }
        if (key === 'appendix6') {
          return (
            <div key={key} className="mt-6 ml-6">
              <h2 id={`section-5-${appNum}`} className="font-bold border-blue-400 border-b-4 mt-4">5.{appNum} {appendix.name}</h2>
              <p>{appendix.description}</p>
              <div className="ml-10 mt-2">
                {appendix.images && appendix.images.map((image: any, idx: number) => (
                  <div key={idx} className="mb-4">
                    <h3 id={`section-5-${appNum}-${idx + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                      5.{appNum}.{idx + 1} {image.title}
                    </h3>
                    <img src={image.url} alt={image.title} className="w-32 h-32 object-contain border my-2 cursor-pointer hover:shadow-lg" />
                  </div>
                ))}
              </div>
            </div>
          );
        }

        // Generic appendix rendering
        return (
          <div key={key} className="mt-6 ml-6">
            <h2 id={`section-5-${appNum}`} className="font-bold border-blue-400 border-b-4 mt-4">5.{appNum} {appendix.name || formatKey(key)}</h2>
            {appendix.description && <p>{appendix.description}</p>}
            {/* Render nested subsections */}
            {Object.entries(appendix).filter(([k]) => k !== 'name' && k !== 'description').map(([subKey, subValue], subIdx) => {
              if (Array.isArray(subValue)) {
                return (
                  <div key={subKey} className="ml-10 mt-2">
                    <h3 className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                      5.{appNum}.{subIdx + 1} {formatKey(subKey)}
                    </h3>
                    <ul className="list-disc list-inside">
                      {subValue.map((item: any, idx: number) => (
                        <li key={idx}>{renderValue(item)}</li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return (
                <div key={subKey} className="ml-10 mt-2">
                  <h3 className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                    5.{appNum}.{subIdx + 1} {formatKey(subKey)}
                  </h3>
                  {typeof subValue === 'object' && !Array.isArray(subValue) ? (
                    <KeyValueTable data={subValue as any} />
                  ) : (
                    <p><strong>{formatKey(subKey)}:</strong> {renderValue(subValue)}</p>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Render References section dynamically
const DynamicReferences: React.FC<{ references: any[] }> = ({ references }) => {
  if (!references || !Array.isArray(references) || references.length === 0) return null;

  return (
    <div className="mb-10">
      <h1 id="section-6" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        6. References
      </h1>
      {references.map((ref: any, refIndex: number) => (
        <div key={refIndex} className="mb-2">
          <h2 className={`font-semibold ${normalizeValue(ref.title) === "No data available" ? "text-gray-500 italic" : ""}`}>
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

// Main Component
const UniversalCompoundRenderer: React.FC = () => {
  const { cid, version } = useParams();
  const { activeSection, handleNavigate } = useIntersectionObserver();
  const { drugsData } = useUser();

  const drug = drugsData.find((d: any) => d.cid === cid && d.version === parseInt(version || '1'));

  if (!drug) {
    return (
      <div className="p-8 text-center text-red-600 text-xl">
        No data found for this drug with CID {cid}.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
      <div className='w-full max-w-7xl flex flex-row gap-4'>
        <div className='flex-1 flex flex-col gap-6 min-w-0 mr-80'>
          {/* Title and Summary - Section 1 */}
          <div className='mb-10' id="section-1">
            <Summary drug={drug} sectionId={1} />
          </div>

          {/* Section 2: Market Information */}
          {drug.marketInformation && <DynamicMarketInformation marketInformation={drug.marketInformation} />}

          {/* Section 3: Drug Substance */}
          {drug.drugSubstance && <DynamicDrugSubstance drugSubstance={drug.drugSubstance} drug={drug} />}

          {/* Section 4: Drug Product */}
          {drug.drugProduct && <DynamicDrugProduct drugProduct={drug.drugProduct} />}

          {/* Section 5: Appendices */}
          {drug.appendices && <DynamicAppendices appendices={drug.appendices} />}

          {/* Section 6: References */}
          {drug.references && <DynamicReferences references={drug.references} />}
        </div>

        {/* Fixed TOC */}
        <div className="fixed right-0 top-20 w-80 h-[calc(100vh-12rem)] overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 shadow-lg" style={{ zIndex: 50 }}>
          <Table
            drug={drug}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default UniversalCompoundRenderer;
