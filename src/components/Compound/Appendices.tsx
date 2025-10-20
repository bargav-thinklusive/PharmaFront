import React from "react";
import { useUser } from "../../context/UserContext";
import { drugData } from "../../sampleData/data";

interface AppendicesProps {
  data?: any[];
}

const renderValue = (value: any) => {
  if (!value) return null;

  if (Array.isArray(value)) {
    return (
      <ul className="list-disc ml-5">
        {value.map((item, index) => (
          <li key={index}>{renderValue(item)}</li>
        ))}
      </ul>
    );
  }

  if (typeof value === "object") {
    return (
      <div className="ml-4">
        {Object.entries(value).map(([key, val], idx) => (
          <div key={idx} className="mb-2">
            <strong>{key}:</strong> {renderValue(val)}
          </div>
        ))}
      </div>
    );
  }

  return <span>{String(value)}</span>;
};

const Appendices: React.FC<AppendicesProps> = ({ data }) => {
  const { drugsData } = useUser();
  const drugs = data || drugData;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appendices</h1>
      {drugs.map((drug: any, drugIndex: number) => (
        <div key={drugIndex} className="mb-10">
          <h2 className="text-xl font-bold mb-4">
            {drug.marketInformation?.brandName}
          </h2>

          {(drug.appendices || []).map((appendix: any, appIndex: number) => (
            <section
              key={appIndex}
              id={`${drug.cid}-appendix-${appIndex + 1}`}
              className="mb-6 p-4 border rounded border-gray-300"
            >
              <h3 className="text-lg font-semibold mb-2">
                {appendix.name || appendix.title}
              </h3>
              {appendix.reference && (
                <p>
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
              {renderValue(appendix)}
            </section>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Appendices;
