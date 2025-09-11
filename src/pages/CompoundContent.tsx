import React from "react";

interface CompoundContentProps {
  data: any[];
}

const CompoundContent: React.FC<CompoundContentProps> = ({ data }) => {
  return (
    <>
      {data.map((item, index) => (
        <div key={index} className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-800">{item.Record.RecordTitle}</h1>
          <p className="text-gray-500">PubChem CID: {item.Record.RecordNumber}</p>

          {item.Record.Section.map((section: any, idx: number) => {
            const sectionId = `${idx + 1}`;
            return (
              <div key={idx} id={sectionId} className="space-y-4 scroll-mt-24">
                <div className="border-b-2 border-cyan-500 pb-1 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {sectionId}. {section.TOCHeading}
                  </h2>
                </div>

                {section.Section?.map((sub: any, sIdx: number) => {
                  const subId = `${sectionId}.${sIdx + 1}`;
                  return (
                    <div key={sIdx} id={subId} className="space-y-2 ml-6 scroll-mt-20">
                      <div className="border-b border-gray-300 pb-1 flex items-center justify-between">
                        <h3 className="text-lg font-medium text-gray-700">
                          {subId}. {sub.TOCHeading}
                        </h3>
                      </div>
                      {sub.Description && (
                        <p className="text-sm text-gray-600 mt-2">{sub.Description}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
};

export default CompoundContent;
