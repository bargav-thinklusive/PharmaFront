// // // import React from 'react'

// // // interface TableProps{
// // //     drug:any;
// // // }

// // // const Table:React.FC<TableProps> = ({drug}) => {
// // //   return (
// // //     <div>Table</div>
// // //   )
// // // }

// // // export default Table



// import React, { useState } from "react";

// interface TableProps {
//   drug: any;
// }

// // Converts camelCase or snake_case to Title Case
// const toTitleCase = (str: string) => {
//   const result = str.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
//   return result.charAt(0).toUpperCase() + result.slice(1);
// };

// const Table: React.FC<TableProps> = ({ drug }) => {
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

//   const toggleSection = (key: string) => {
//     setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   const hasContent = (val: any): boolean => {
//     if (val === null || val === undefined) return false;
//     if (typeof val === "string" && val.trim() === "") return false;
//     if (Array.isArray(val) && val.length === 0) return false;
//     if (typeof val === "object" && Object.keys(val).length === 0) return false;
//     return true;
//   };

//   // Determine if a value is an object that should show dropdown
//   const isExpandable = (val: any) => {
//     return typeof val === "object" && val !== null && Object.keys(val).length > 0;
//   };

//   const renderSubsections = (data: any, parentKey: string, prefix: string) => {
//     return Object.entries(data).map(([subKey, subValue], idx) => {
//       if (!hasContent(subValue)) return null;

//       const numbering = `${prefix}.${idx + 1}`;
//       const expandable = isExpandable(subValue);

//       return (
//         <div key={subKey} style={{ marginLeft: "16px", color: "black" }}>
//           <div
//             onClick={() => expandable && toggleSection(parentKey + subKey)}
//             style={{
//               cursor: expandable ? "pointer" : "default",
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "center",
//               lineHeight: "1.6",
//             }}
//           >
//             <span>
//               {numbering} {toTitleCase(subKey)}
//             </span>
//             {expandable && <span>{openSections[parentKey + subKey] ? "▼" : "►"}</span>}
//           </div>

//           {expandable && openSections[parentKey + subKey] && renderSubsections(subValue, parentKey + subKey, numbering)}
//         </div>
//       );
//     });
//   };

//   const filteredKeys = Object.keys(drug).filter(
//     (key) => key !== "appendices" && key !== "cid" && key !== "title" && key !== "summary"
//   );

//   const displayName = (key: string) => {
//     if (key === "marketInformation") return "Market Information";
//     return toTitleCase(key);
//   };

//   return (
//     <div style={{ padding: "12px" }}>
//       <h2 style={{ fontWeight: "bold", color: "black", marginBottom: "8px" }}>
//         Table of Contents
//       </h2>

//       {/* Title and Summary - no arrow */}
//       <div style={{ color: "black", marginBottom: "4px" ,fontWeight: "bold",}}>1. Title and Summary</div>

//       {/* Main sections */}
//       {filteredKeys.map((key, idx) => {
//         if (!hasContent(drug[key])) return null;

//         const sectionNumber = idx + 2; // Title & Summary = 1
//         const isReferences = key.toLowerCase() === "references";

//         const expandable = !isReferences && isExpandable(drug[key]);

//         return (
//           <div key={key} style={{ marginTop: "6px", color: "black" }}>
//             <div
//               onClick={() => expandable && toggleSection(key)}
//               style={{
//                 cursor: expandable ? "pointer" : "default",
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 fontWeight: "bold",
//                 lineHeight: "1.6",
//               }}
//             >
//               <span>
//                 {sectionNumber}. {displayName(key)}
//               </span>
//               {expandable && <span>{openSections[key] ? "▼" : "►"}</span>}
//             </div>

//             {expandable && openSections[key] && (
//               <div>{renderSubsections(drug[key], key, sectionNumber.toString())}</div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Table;










import React, { useState } from "react";

interface TableProps {
  drug: any;
}

const toTitleCase = (str: string) => {
  const result = str.replace(/([A-Z])/g, " $1").replace(/_/g, " ");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const Table: React.FC<TableProps> = ({ drug }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const hasContent = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && Object.keys(val).length === 0) return false;
    return true;
  };

  const isExpandable = (val: any) => {
    return typeof val === "object" && val !== null && Object.keys(val).length > 0;
  };

  const renderSubsections = (data: any, parentKey: string, prefix: string) => {
    return Object.entries(data).map(([subKey, subValue], idx) => {
      if (!hasContent(subValue)) return null;

      const numbering = `${prefix}.${idx + 1}`;
      const expandable = isExpandable(subValue);

      return (
        <div key={subKey} className="ml-4 text-gray-700">
          <div
            onClick={() => expandable && toggleSection(parentKey + subKey)}
            className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
              expandable ? 'text-blue-600 hover:underline' : 'text-gray-700'
            }`}
          >
            <span>{numbering} {toTitleCase(subKey)}</span>
            {expandable && (
              <span className="text-gray-400 text-xs">
                {openSections[parentKey + subKey] ? "▼" : "►"}
              </span>
            )}
          </div>

          {expandable && openSections[parentKey + subKey] && (
            <div className="ml-2">
              {renderSubsections(subValue, parentKey + subKey, numbering)}
            </div>
          )}
        </div>
      );
    });
  };

  const filteredKeys = Object.keys(drug).filter(
    (key) => key !== "appendices" && key !== "cid" && key !== "title" && key !== "summary"
  );

  const displayName = (key: string) => {
    const nameMap: Record<string, string> = {
      'marketInformation': 'Market Information',
      'drugSubstance': 'Drug Substance',
      'drugProduct': 'Drug Product',
      'references': 'References'
    };
    return nameMap[key] || toTitleCase(key);
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-80 h-screen overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
        CONTENTS
      </h3>

      {/* Use and Summary - Active Section */}
      <div className="bg-blue-500 text-white px-3 py-2 rounded text-sm mb-2 font-medium">
        Title and Summary
      </div>


      {/* Main sections from drug data */}
      {filteredKeys.map((key, idx) => {
        if (!hasContent(drug[key])) return null;

        const sectionNumber = idx + 2; // Structures = 1, so start from 2
        const isReferences = key.toLowerCase() === "references";
        const expandable = !isReferences && isExpandable(drug[key]);

        return (
          <div key={key} className="mb-1">
            <div
              onClick={() => expandable && toggleSection(key)}
              className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
                expandable ? 'text-blue-600 hover:underline' : 'text-blue-600 hover:underline'
              }`}
            >
              <span>{sectionNumber}. {displayName(key)}</span>
              {expandable && (
                <span className="text-gray-400 text-xs">
                  {openSections[key] ? "▼" : "►"}
                </span>
              )}
            </div>

            {expandable && openSections[key] && (
              <div className="ml-2">
                {renderSubsections(drug[key], key, sectionNumber.toString())}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Table;

