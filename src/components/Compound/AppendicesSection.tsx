import React from 'react';
import { IoIosLink } from 'react-icons/io';
import { formatKey } from '../../utils/utils';

interface AppendicesSectionProps {
  appendices: any;
}

const Appendix1: React.FC<{ appendix1: any }> = ({ appendix1 }) => (
  <div>
    <div className="ml-6">
      <div className="flex flex-row justify-between align-center border-blue-400 border-b-4">
        <h2 id="section-5-1" className="font-semibold">5.1 {appendix1.name}</h2>
        <a
          href={appendix1.reference}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IoIosLink className="cursor-pointer text-blue-600" style={{ color: "black" }} />
        </a>
      </div>
      <p>{appendix1.description}</p>
    </div>
    <div className="ml-10">
      <h3 id="section-5-1-1" className="font-semibold border-blue-400 border-b-4">5.1.1 Modular Synthesis</h3>
      <p>{appendix1.modularSynthesis.overview}</p>
      <div className="ml-12">
        {appendix1.modularSynthesis.steps.map((step: any, index: number) => (
          <React.Fragment key={index}>
            <div className="font-semibold border-blue-400 border-b-4">
              <strong>5.1.1.{index + 1} {step.name}</strong>
            </div>
            {step.details.map((detail: string, detailIndex: number) => (
              <p key={detailIndex}>{detail}</p>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
    <div className="ml-10">
      <h3 id="section-5-1-2" className="font-semibold border-blue-400 border-b-4">5.1.2 Synthesis Steps</h3>
      <div className="ml-12">
        {appendix1.synthesisSteps.map((step: any, index: number) => (
          <div key={index} className="mb-4">
            <div className="font-semibold border-blue-400 border-b-4 pb-1">
              5.1.2.{index + 1}. {step.title}
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

const Appendix2: React.FC<{ appendix2: any }> = ({ appendix2 }) => (
  <div className="mt-6">
    <div className="ml-6">
      <h2 id="section-5-2" className="flex flex-row justify-between align-center border-blue-400 border-b-4 font-bold">
        5.2 {appendix2.name}
      </h2>
    </div>
    <div className="ml-10">
      {Object.entries(appendix2.specifications).map(
        ([key, value], index) => {
          if (value === undefined || value === "N/A" || (typeof value === "string" && value.trim() === "")) return null;
          return (
            <div key={index} className="mb-2">
              <h3 id={`section-5-2-${index + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1">
                5.2.{index + 1} {formatKey(key)}
              </h3>
              <p>{String(value)}</p>
            </div>
          );
        }
      )}
    </div>
  </div>
);

const Appendix3: React.FC<{ appendix3: any }> = ({ appendix3 }) => (
  <div className="mt-6 ml-6">
    <h2 id="section-5-3" className="font-bold border-blue-400 border-b-4">5.3 {appendix3.name}</h2>
    <p>{appendix3.note}</p>
    <div className="ml-10 mt-2">
      <h3 id="section-5-3-1" className="font-semibold border-blue-400 border-b-4 pb-1">5.3.1 Inactive Ingredients</h3>
      <table className="table-auto border-collapse border border-gray-400 w-full mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-400 px-4 py-2 text-left">Ingredient Name</th>
            <th className="border border-gray-400 px-4 py-2 text-left">Strength</th>
          </tr>
        </thead>
        <tbody>
          {appendix3.inactiveIngredients.map((ingredient: any, index: number) => (
            <tr key={index}>
              <td className="border border-gray-400 px-4 py-2">{ingredient.ingredientName}</td>
              <td className="border border-gray-400 px-4 py-2">{ingredient.strength}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Appendix4: React.FC<{ appendix4: any }> = ({ appendix4 }) => (
  <div className="mt-6 ml-6">
    <h2 id="section-5-4" className="font-bold border-blue-400 border-b-4">5.4 {appendix4.name}</h2>
    <ul className="list-disc list-inside">
      {appendix4.labels.map((item: any, index: number) => (
        <li key={index}>
          <p>{item.label}</p>
          <img src={item.image} alt={item.label} className="w-64 h-64 object-contain border my-2 cursor-pointer hover:shadow-lg" />
        </li>
      ))}
    </ul>
  </div>
);

const Appendix5: React.FC<{ appendix5: any }> = ({ appendix5 }) => (
  <div className="mt-6 ml-6">
    <div>
      <h2 id="section-5-5" className="font-bold border-blue-400 border-b-4">5.5 {appendix5.name}</h2>
      <p>{appendix5.description}</p>
      <div className="ml-10 mt-2">
        {Object.entries(appendix5.designations).map(([key, value], index) => (
          <div key={index} className="mb-4">
            <h3 id={`section-5-5-${index + 1}`} className="font-semibold border-blue-400 border-b-4 pb-1">
              5.5.{index + 1} {formatKey(key)}
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

const AppendicesSection: React.FC<AppendicesSectionProps> = ({ appendices }) => {
  return (
    <div className="mb-10">
      <h1 id="section-5" className="text-2xl font-bold border-blue-400 border-b-4 pb-1 mb-4">
        5. Appendices
      </h1>
      <Appendix1 appendix1={appendices?.appendix1} />
      <Appendix2 appendix2={appendices?.appendix2} />
      <Appendix3 appendix3={appendices?.appendix3} />
      <Appendix4 appendix4={appendices?.appendix4} />
      <Appendix5 appendix5={appendices?.appendix5} />
    </div>
  );
};

export default AppendicesSection;