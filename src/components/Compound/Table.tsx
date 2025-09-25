// import React, { useState } from "react";

// interface TableProps {
//   drug: any;
// }

// const toTitleCase = (str: unknown): string => {
//   if (str === null || str === undefined) return "";
//   const s = String(str)
//     .replace(/([A-Z])/g, " $1")
//     .replace(/[_\-]+/g, " ")
//     .replace(/\s+/g, " ")
//     .trim();
//   return s.charAt(0).toUpperCase() + s.slice(1);
// };

// const normalizeKey = (k: string) =>
//   String(k).replace(/[^a-z0-9]/gi, "").toLowerCase();

// const Table: React.FC<TableProps> = ({ drug }) => {
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

//   const toggleSection = (key: string) => {
//     setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const hasContent = (val: any): boolean => {
//     if (val === null || val === undefined) return false;
//     if (typeof val === "string" && val.trim() === "") return false;
//     if (Array.isArray(val) && val.length === 0) return false;
//     if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0)
//       return false;
//     return true;
//   };

//   const isPlainObject = (val: any) =>
//     typeof val === "object" && val !== null && !Array.isArray(val);

//   // Keys that should not expand
//   const nonExpandableNormalized = new Set([
//     "strengths",
//     "packagingandstorageconditions",
//     "manufacturingsites",
//     "manufacturing_sites",
//     "manufacturing",
//     "strength",
//     "packaging",
//   ]);

//   const shouldSkipExpansion = (key: string) =>
//     nonExpandableNormalized.has(normalizeKey(key));

//   const displayName = (key: string) => {
//     const nameMap: Record<string, string> = {
//       marketInformation: "Market Information",
//       drugSubstance: "Drug Substance",
//       drugProduct: "Drug Product",
//       references: "References",
//     };
//     return nameMap[key] || toTitleCase(key);
//   };

//   const filteredKeys = Object.keys(drug || {}).filter(
//     (key) =>
//       key !== "appendices" &&
//       key !== "cid" &&
//       key !== "title" &&
//       key !== "summary" &&
//       hasContent(drug[key])
//   );

//   return (
//     <div className="bg-white border border-gray-300 rounded-lg p-4 w-80 h-screen overflow-y-auto">
//       <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
//         CONTENTS
//       </h3>

//       {/* Title & Summary */}
//       <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm mb-2 font-medium">
//         Title and Summary
//       </div>

//       {/* Main Sections */}
//       {filteredKeys.map((key, idx) => {
//         const sectionNumber = idx + 2;
//         const sectionValue = drug[key];
//         const normalized = normalizeKey(key);
//         const isReferences = normalized === "references";

//         // References should NOT expand, no numbering
//         if (isReferences) {
//           return (
//             <div key={key} className="mb-1">
//               <div className="flex items-center py-1 px-2 text-gray-800 text-sm">
//                 {displayName(key)}
//               </div>
//             </div>
//           );
//         }

//         const skipThis = shouldSkipExpansion(key);

//         const expandable =
//           isPlainObject(sectionValue) &&
//           !skipThis &&
//           Object.entries(sectionValue || {}).some(
//             ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//           );

//         const visibleChildEntries = isPlainObject(sectionValue)
//           ? Object.entries(sectionValue as Record<string, any>).filter(
//               ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//             )
//           : [];

//         return (
//           <div key={key} className="mb-1">
//             <div
//               onClick={() => expandable && toggleSection(key)}
//               className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm`}
//               role={expandable ? "button" : undefined}
//               tabIndex={expandable ? 0 : -1}
//               onKeyDown={(e) => {
//                 if (expandable && (e.key === "Enter" || e.key === " ")) {
//                   e.preventDefault();
//                   toggleSection(key);
//                 }
//               }}
//             >
//               <span className="text-gray-800">
//                 {sectionNumber}. {displayName(key)}
//               </span>
//               {expandable ? (
//                 <span className="text-gray-400 text-xs">
//                   {openSections[key] ? "▼" : "►"}
//                 </span>
//               ) : null}
//             </div>

//             {/* Subsections */}
//             {expandable && openSections[key] && visibleChildEntries.length > 0 && (
//               <div className="ml-4 mt-1">
//                 {visibleChildEntries.map(([subKey, subValue], i) => {
//                   const subsectionNumber = `${sectionNumber}.${i + 1}`;
//                   const childExpandable =
//                     isPlainObject(subValue) &&
//                     Object.entries(subValue as Record<string, any>).some(
//                       ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//                     );

//                   const visibleGrandChildren = isPlainObject(subValue)
//                     ? Object.entries(subValue as Record<string, any>).filter(
//                         ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//                       )
//                     : [];

//                   return (
//                     <div key={subKey} className="mb-1">
//                       <div
//                         onClick={() =>
//                           childExpandable && toggleSection(`${key}.${subKey}`)
//                         }
//                         className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm`}
//                       >
//                         <span className="text-gray-800">
//                           {subsectionNumber} {toTitleCase(subKey)}
//                         </span>
//                         {childExpandable ? (
//                           <span className="text-gray-400 text-xs">
//                             {openSections[`${key}.${subKey}`] ? "▼" : "►"}
//                           </span>
//                         ) : null}
//                       </div>

//                       {/* Sub-subsections */}
//                       {childExpandable &&
//                         openSections[`${key}.${subKey}`] &&
//                         visibleGrandChildren.length > 0 && (
//                           <div className="ml-4 mt-1">
//                             {visibleGrandChildren.map(([gcKey, _], j) => {
//                               const numbering = `${subsectionNumber}.${j + 1}`;
//                               return (
//                                 <div
//                                   key={gcKey}
//                                   className="flex justify-between items-center py-1 px-2 rounded text-sm"
//                                 >
//                                   <span className="text-gray-800">
//                                     {numbering} {toTitleCase(gcKey)}
//                                   </span>
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         )}
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Table;




import React, { useState, useEffect } from "react";

interface TableProps {
  drug: any;
  activeSection: string;
}

const toTitleCase = (str: unknown): string => {
  if (str === null || str === undefined) return "";
  const s = String(str)
    .replace(/([A-Z])/g, " $1")
    .replace(/[_\-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const normalizeKey = (k: string) =>
  String(k).replace(/[^a-z0-9]/gi, "").toLowerCase();

const Table: React.FC<TableProps> = ({ drug, activeSection }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    if (!activeSection) return;
    const newOpen: Record<string, boolean> = {};
    if (activeSection.startsWith('section-1-')) {
      newOpen['marketInformation'] = true;
    } else if (activeSection.startsWith('section-2-')) {
      newOpen['drugSubstance'] = true;
      if (activeSection.startsWith('section-2-1')) {
        newOpen['drugSubstance.physicalAndChemicalProperties'] = true;
      } else if (activeSection.startsWith('section-2-2')) {
        newOpen['drugSubstance.processDevelopment'] = true;
      } else if (activeSection.startsWith('section-2-3')) {
        newOpen['drugSubstance.analyticalDevelopment'] = true;
      }
    } else if (activeSection.startsWith('section-3-')) {
      newOpen['drugProduct'] = true;
    } else if (activeSection.startsWith('section-4-')) {
      // references, no sub
    }
    setOpenSections(newOpen);
  }, [activeSection]);

  const hasContent = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0)
      return false;
    return true;
  };

  const isPlainObject = (val: any) =>
    typeof val === "object" && val !== null && !Array.isArray(val);

  const nonExpandableNormalized = new Set([
    "strengths",
    "packagingandstorageconditions",
    "manufacturingsites",
    "manufacturing_sites",
    "manufacturing",
    "strength",
    "packaging",
  ]);

  const shouldSkipExpansion = (key: string) =>
    nonExpandableNormalized.has(normalizeKey(key));

  const displayName = (key: string) => {
    const nameMap: Record<string, string> = {
      marketInformation: "Market Information",
      drugSubstance: "Drug Substance",
      drugProduct: "Drug Product",
      references: "References",
      summary: "Title and Summary",
      title: "Title and Summary",
    };
    return nameMap[key] || toTitleCase(key);
  };

  // Merge title and summary as single section
  const mainKeys = Object.keys(drug || {}).filter(
    (key) =>
      key !== "appendices" &&
      key !== "cid" &&
      key !== "title" &&
      key !== "summary" &&
      key !== "references" &&
      hasContent(drug[key])
  );

  // Build final sections: Title & Summary always + mainKeys + References once (if exists)
  const sectionKeys: string[] = ["title_and_summary", ...mainKeys];
  if ("references" in drug && hasContent(drug.references)) {
    sectionKeys.push("references");
  }

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-80 h-screen overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
        CONTENTS
      </h3>

      {sectionKeys.map((key, idx) => {
        const sectionNumber = idx;

        // Special handling for title_and_summary
        let sectionValue: any = null;
        if (key === "title_and_summary") {
          sectionValue = {
            ...(drug.title || {}),
            ...(drug.summary || {}),
          };
        } else {
          sectionValue = drug[key];
        }

        const normalized = normalizeKey(key);
        const isReferences = normalized === "references";
        const isTitleSummary = key === "title_and_summary";

        const skipThis = shouldSkipExpansion(key) || isReferences || isTitleSummary;

        const expandable =
          isPlainObject(sectionValue) &&
          !skipThis &&
          Object.entries(sectionValue as Record<string, any>).some(
            ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
          );

        const visibleChildEntries = isPlainObject(sectionValue)
          ? Object.entries(sectionValue as Record<string, any>).filter(
              ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
            )
          : [];

        return (
          <div key={key} className="mb-1">
            <div
              onClick={() => {
                const element = document.getElementById(`section-${sectionNumber}`);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
                if (expandable) toggleSection(key);
              }}
              className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${activeSection === `section-${sectionNumber}` ? 'bg-blue-500 text-white' : ''}`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  const element = document.getElementById(`section-${sectionNumber}`);
                  if (element) element.scrollIntoView({ behavior: 'smooth' });
                  if (expandable) toggleSection(key);
                }
              }}
            >
              <span className="text-gray-800">
                {idx === 0 ? '' : `${sectionNumber}. `}{displayName(key)}
              </span>
              {expandable ? (
                <span className="text-gray-400 text-xs">
                  {openSections[key] ? "▼" : "►"}
                </span>
              ) : null}
            </div>

            {/* Subsections */}
            {expandable && openSections[key] && visibleChildEntries.length > 0 && (
              <div className="ml-4 mt-1">
                {visibleChildEntries.map(([subKey, subValue], i) => {
                  const subsectionNumber = `${sectionNumber}.${i + 1}`;
                  const childExpandable =
                    isPlainObject(subValue) &&
                    Object.entries(subValue as Record<string, any>).some(
                      ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
                    );

                  const visibleGrandChildren = isPlainObject(subValue)
                    ? Object.entries(subValue as Record<string, any>).filter(
                        ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
                      )
                    : [];

                  return (
                    <div key={subKey} className="mb-1">
                      <div
                        onClick={() => {
                          const element = document.getElementById(`section-${sectionNumber}-${i + 1}`);
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                          if (childExpandable) toggleSection(`${key}.${subKey}`);
                        }}
                        className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${activeSection === `section-${sectionNumber}-${i + 1}` ? 'bg-blue-500 text-white' : ''}`}
                      >
                        <span className="text-gray-800">
                          {subsectionNumber} {toTitleCase(subKey)}
                        </span>
                        {childExpandable ? (
                          <span className="text-gray-400 text-xs">
                            {openSections[`${key}.${subKey}`] ? "▼" : "►"}
                          </span>
                        ) : null}
                      </div>

                      {/* Sub-subsections */}
                      {childExpandable &&
                        openSections[`${key}.${subKey}`] &&
                        visibleGrandChildren.length > 0 && (
                          <div className="ml-4 mt-1">
                            {visibleGrandChildren.map(([gcKey, _], j) => {
                              const numbering = `${subsectionNumber}.${j + 1}`;
                              return (
                                <div
                                  key={gcKey}
                                  onClick={() => {
                                    const element = document.getElementById(`section-${sectionNumber}-${i + 1}-${j + 1}`);
                                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                                  }}
                                  className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer hover:bg-blue-50 ${activeSection && `section-${sectionNumber}-${i + 1}-${j + 1}` === activeSection ? 'bg-blue-500 text-white' : ''}`}
                                >
                                  <span className="text-gray-800">
                                    {numbering} {toTitleCase(gcKey)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Table;







