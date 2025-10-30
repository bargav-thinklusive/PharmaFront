import React from 'react';
import { IoIosLink } from 'react-icons/io';
import { formatKey, normalizeValue } from '../../../../utils/utils';

interface DynamicAppendicesProps {
  appendices: any;
}

const DynamicAppendices: React.FC<DynamicAppendicesProps> = ({ appendices }) => {
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
                        <li key={idx}>{item}</li>
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
                    <div>Object rendering not implemented</div>
                  ) : (
                    <p><strong>{formatKey(subKey)}:</strong> {String(subValue)}</p>
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

export default DynamicAppendices;