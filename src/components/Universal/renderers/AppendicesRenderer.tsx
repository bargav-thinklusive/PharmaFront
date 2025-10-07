import React from 'react';
import { IoIosLink } from 'react-icons/io';
import { formatKey, APPENDIX_KEYS } from '../utils';

export const renderAppendices = (appendices: any) => {
  return (
    <div>
      {APPENDIX_KEYS.map((appendixKey, i) => {
        const appendix = appendices[appendixKey];
        if (!appendix) return null;

        return (
          <div key={appendixKey}>
            {renderAppendix(appendix, i + 1)}
          </div>
        );
      })}
    </div>
  );
};

const renderAppendix = (appendix: any, index: number) => {
  const appendixId = `section-5-${index}`;

  if (index === 1) {
    // Appendix 1 - Modular Synthesis
    return (
      <div>
        <div className="ml-6">
          <div className="flex flex-row justify-between align-center border-blue-400 border-b-4 mt-4">
            <h2 id={appendixId} className="font-semibold">5.{index} {appendix.name}</h2>
            <a
              href={appendix.reference}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoIosLink className="cursor-pointer text-blue-600" style={{ color: "black" }} />
            </a>
          </div>
          <p>{appendix.description}</p>
        </div>
        <div className="ml-10">
          <h3 id={`${appendixId}-1`} className="font-semibold border-blue-400 border-b-4 mt-4">5.{index}.1 Modular Synthesis</h3>
          <p>{appendix.modularSynthesis.overview}</p>
          <div className="ml-12">
            {appendix.modularSynthesis.steps.map((step: any, stepIndex: number) => (
              <React.Fragment key={stepIndex}>
                <div className="font-semibold border-blue-400 border-b-4 mt-4">
                  <strong>5.{index}.1.{stepIndex + 1} {step.name}</strong>
                </div>
                {step.details.map((detail: string, detailIndex: number) => (
                  <p key={detailIndex}>{detail}</p>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="ml-10">
          <h3 id={`${appendixId}-2`} className="font-semibold border-blue-400 border-b-4 mt-4">5.{index}.2 Synthesis Steps</h3>
          <div className="ml-12">
            {appendix.synthesisSteps.map((step: any, stepIndex: number) => (
              <div key={stepIndex} className="mb-4">
                <div className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                  5.{index}.2.{stepIndex + 1}. {step.title}
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

  if (index === 2) {
    // Appendix 2 - Specifications
    return (
      <div className="mt-6">
        <div className="ml-6">
          <h2 id={appendixId} className="flex flex-row justify-between align-center border-blue-400 border-b-4 font-bold mt-4">
            5.{index} {appendix.name}
          </h2>
        </div>
        <div className="ml-10">
          {Object.entries(appendix.specifications).map(
            ([key, value], specIndex) => {
              if (value === undefined || value === "N/A" || (typeof value === "string" && value.trim() === "")) return null;
              return (
                <div key={specIndex} className="mb-2">
                  <h3 id={`${appendixId}-${specIndex + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                    5.{index}.{specIndex + 1} {formatKey(key)}
                  </h3>
                  <p>{String(value)}</p>
                </div>
              );
            }
          )}
        </div>
      </div>
    );
  }

  if (index === 3) {
    // Appendix 3 - Inactive Ingredients
    return (
      <div className="mt-6 ml-6">
        <h2 id={appendixId} className="font-bold border-blue-400 border-b-4 mt-4">5.{index} {appendix.name}</h2>
        <p>{appendix.note}</p>
        <div className="ml-10 mt-2">
          <h3 id={`${appendixId}-1`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">5.{index}.1 Inactive Ingredients</h3>
          <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 px-4 py-2 text-left">Ingredient Name</th>
                <th className="border border-gray-400 px-4 py-2 text-left">Strength</th>
              </tr>
            </thead>
            <tbody>
              {appendix.inactiveIngredients.map((ingredient: any, ingIndex: number) => (
                <tr key={ingIndex}>
                  <td className="border border-gray-400 px-4 py-2">{ingredient.ingredientName}</td>
                  <td className="border border-gray-400 px-4 py-2">{ingredient.strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (index === 4) {
    // Appendix 4 - Labels
    return (
      <div className="mt-6 ml-6">
        <h2 id={appendixId} className="font-bold border-blue-400 border-b-4 mt-4">5.{index} {appendix.name}</h2>
        <ul className="list-disc list-inside">
          {appendix.labels.map((item: any, labelIndex: number) => (
            <li key={labelIndex}>
              <p>{item.label}</p>
              <img src={item.image} alt={item.label} className="w-64 h-64 object-contain border my-2 cursor-pointer hover:shadow-lg" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (index === 5) {
    // Appendix 5 - Designations
    return (
      <div className="mt-6 ml-6">
        <div>
          <h2 id={appendixId} className="font-bold border-blue-400 border-b-4 mt-4">5.{index} {appendix.name}</h2>
          <p>{appendix.description}</p>
          <div className="ml-10 mt-2">
            {Object.entries(appendix.designations).map(([key, value], desIndex) => (
              <div key={desIndex} className="mb-4">
                <h3 id={`${appendixId}-${desIndex + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1 mt-4">
                  5.{index}.{desIndex + 1} {formatKey(key)}
                </h3>
                {Array.isArray(value) ? (
                  <ul className="list-disc list-inside">
                    {value.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{String(value)}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};