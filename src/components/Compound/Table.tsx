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




// import React, { useState, useEffect, useMemo } from "react";

// interface TableProps {
//   drug: any;
//   activeSection: string;
//   onNavigate?: (sectionId: string) => void;
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

// const Table: React.FC<TableProps> = ({ drug, activeSection, onNavigate }) => {
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

//   const hasContent = (val: any): boolean => {
//     if (val === null || val === undefined) return false;
//     if (typeof val === "string" && val.trim() === "") return false;
//     if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
//     if (Array.isArray(val) && val.length === 0) return false;
//     if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
//     return true;
//   };

//   const isPlainObject = (val: any) =>
//     typeof val === "object" && val !== null && !Array.isArray(val);

//   // Define the section structure to match CompoundInformation
//   const sectionStructure = useMemo(() => [
//     {
//       id: 0,
//       key: 'title_and_summary',
//       title: 'Title and Summary',
//       hasSubsections: false
//     },
//     {
//       id: 1,
//       key: 'marketInformation',
//       title: 'Market Information',
//       hasSubsections: true,
//       data: drug?.marketInformation
//     },
//     {
//       id: 2,
//       key: 'drugSubstance',
//       title: 'Drug Substance',
//       hasSubsections: true,
//       data: drug?.drugSubstance,
//       subsections: [
//         { key: 'physicalAndChemicalProperties', title: 'Physical And Chemical Properties' },
//         { key: 'processDevelopment', title: 'Process Development' },
//         { key: 'analyticalDevelopment', title: 'Analytical Development' }
//       ]
//     },
//     {
//       id: 3,
//       key: 'drugProduct',
//       title: 'Drug Product',
//       hasSubsections: true,
//       data: drug?.drugProduct?.information
//     },
//     {
//       id: 4,
//       key: 'references',
//       title: 'References',
//       hasSubsections: false,
//       data: drug?.references
//     }
//   ], [drug]);

//   // Auto-expand sections based on activeSection
//   useEffect(() => {
//     if (!activeSection) return;
    
//     const newOpen: Record<string, boolean> = {};
    
//     // Parse section ID (e.g., "section-2-1-3" -> [2, 1, 3])
//     const parts = activeSection.replace('section-', '').split('-').map(Number);
    
//     if (parts.length >= 1) {
//       const sectionId = parts[0];
//       const section = sectionStructure.find(s => s.id === sectionId);
      
//       if (section && section.hasSubsections) {
//         newOpen[section.key] = true;
        
//         // Handle subsection expansion for drugSubstance
//         if (section.key === 'drugSubstance' && parts.length >= 2) {
//           const subSectionIdx = parts[1] - 1; // Convert to 0-based
//           if (section.subsections && section.subsections[subSectionIdx]) {
//             const subKey = section.subsections[subSectionIdx].key;
//             newOpen[`${section.key}.${subKey}`] = true;
//           }
//         }
        
//         // Handle subsection expansion for other sections
//         if (section.key !== 'drugSubstance' && parts.length >= 2) {
//           const subSectionIdx = parts[1] - 1; // Convert to 0-based
//           if (section.data && isPlainObject(section.data)) {
//             const visibleChildren = Object.entries(section.data).filter(
//               ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//             );
            
//             if (visibleChildren[subSectionIdx]) {
//               const [subKey] = visibleChildren[subSectionIdx];
//               newOpen[`${section.key}.${subKey}`] = true;
//             }
//           }
//         }
//       }
//     }
    
//     setOpenSections(prev => ({ ...prev, ...newOpen }));
//   }, [activeSection, sectionStructure]);

//   const scrollToSection = (sectionId: string) => {
//     onNavigate?.(sectionId);
    
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const renderSubsections = (section: any, sectionData: any) => {
//     if (section.key === 'drugSubstance' && section.subsections) {
//       // Handle drugSubstance with predefined subsections
//       return section.subsections.map((subsection: any, i: number) => {
//         const subsectionId = `section-${section.id}-${i + 1}`;
//         const subsectionData = sectionData?.[subsection.key];
//         const isActiveSubsection = activeSection === subsectionId || activeSection.startsWith(`${subsectionId}-`);
        
//         if (!hasContent(subsectionData)) return null;

//         const childExpandable = isPlainObject(subsectionData) &&
//           Object.entries(subsectionData).some(([k, v]) => !/^\d+$/.test(k) && hasContent(v));

//         const visibleGrandChildren = childExpandable
//           ? Object.entries(subsectionData).filter(([k, v]) => !/^\d+$/.test(k) && hasContent(v))
//           : [];

//         return (
//           <div key={subsection.key} className="mb-1">
//             <div
//               onClick={() => {
//                 scrollToSection(subsectionId);
//                 if (childExpandable) {
//                   setOpenSections(prev => ({ 
//                     ...prev, 
//                     [`${section.key}.${subsection.key}`]: !prev[`${section.key}.${subsection.key}`] 
//                   }));
//                 }
//               }}
//               className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
//                 isActiveSubsection ? 'bg-blue-500 text-white' : ''
//               }`}
//             >
//               <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
//                 {section.id}.{i + 1} {subsection.title}
//               </span>
//               {childExpandable && (
//                 <span className={`${isActiveSubsection ? 'text-white' : 'text-gray-400'} text-xs`}>
//                   {openSections[`${section.key}.${subsection.key}`] ? "▼" : "►"}
//                 </span>
//               )}
//             </div>

//             {/* Sub-subsections for drugSubstance */}
//             {childExpandable && openSections[`${section.key}.${subsection.key}`] && 
//              visibleGrandChildren.length > 0 && (
//               <div className="ml-4 mt-1">
//                 {visibleGrandChildren.map(([gcKey], j) => {
//                   const subSubsectionId = `section-${section.id}-${i + 1}-${j + 1}`;
//                   const isActiveSubSubsection = activeSection === subSubsectionId;

//                   return (
//                     <div
//                       key={gcKey}
//                       onClick={() => scrollToSection(subSubsectionId)}
//                       className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer hover:bg-blue-50 ${
//                         isActiveSubSubsection ? 'bg-blue-500 text-white' : ''
//                       }`}
//                     >
//                       <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
//                         {section.id}.{i + 1}.{j + 1} {toTitleCase(gcKey)}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       });
//     } else {
//       // Handle other sections with dynamic subsections
//       if (!isPlainObject(sectionData)) return null;

//       const visibleChildren = Object.entries(sectionData).filter(
//         ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//       );

//       return visibleChildren.map(([subKey, subValue], i) => {
//         const subsectionId = `section-${section.id}-${i + 1}`;
//         const isActiveSubsection = activeSection === subsectionId || activeSection.startsWith(`${subsectionId}-${subValue}`);

//         return (
//           <div
//             key={subKey}
//             onClick={() => scrollToSection(subsectionId)}
//             className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
//               isActiveSubsection ? 'bg-blue-500 text-white' : ''
//             }`}
//           >
//             <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
//               {section.id}.{i + 1} {toTitleCase(subKey)}
//             </span>
//           </div>
//         );
//       });
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-300 rounded-lg p-4 w-80 h-screen overflow-y-auto">
//       <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
//         CONTENTS
//       </h3>

//       {sectionStructure.map((section) => {
//         if (!hasContent(section.data) && section.key !== 'title_and_summary') return null;

//         const sectionId = `section-${section.id}`;
//         const isActiveSection = activeSection === sectionId || activeSection.startsWith(`${sectionId}-`);
//         const expandable = section.hasSubsections && hasContent(section.data);

//         return (
//           <div key={section.key} className="mb-1">
//             <div
//               onClick={() => {
//                 scrollToSection(sectionId);
//                 if (expandable) {
//                   setOpenSections(prev => ({ ...prev, [section.key]: !prev[section.key] }));
//                 }
//               }}
//               className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
//                 isActiveSection ? 'bg-blue-500 text-white' : ''
//               }`}
//               role="button"
//               tabIndex={0}
//             >
//               <span className={isActiveSection ? 'text-white' : 'text-gray-800'}>
//                 {section.id}. {section.title}
//               </span>
//               {expandable && (
//                 <span className={`${isActiveSection ? 'text-white' : 'text-gray-400'} text-xs`}>
//                   {openSections[section.key] ? "▼" : "►"}
//                 </span>
//               )}
//             </div>

//             {/* Subsections */}
//             {expandable && openSections[section.key] && (
//               <div className="ml-4 mt-1">
//                 {renderSubsections(section, section.data)}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Table;



// import React, { useState, useEffect, useMemo } from "react";

// interface TableProps {
//   drug: any;
//   activeSection: string;
//   onNavigate?: (sectionId: string) => void;
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

// const Table: React.FC<TableProps> = ({ drug, activeSection, onNavigate }) => {
//   const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

//   const hasContent = (val: any): boolean => {
//     if (val === null || val === undefined) return false;
//     if (typeof val === "string" && val.trim() === "") return false;
//     if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
//     if (Array.isArray(val) && val.length === 0) return false;
//     if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
//     return true;
//   };

//   const isPlainObject = (val: any) =>
//     typeof val === "object" && val !== null && !Array.isArray(val);

//   const sectionStructure = useMemo(() => [
//     {
//       id: 0,
//       key: 'title_and_summary',
//       title: 'Title and Summary',
//       hasSubsections: false
//     },
//     {
//       id: 1,
//       key: 'marketInformation',
//       title: 'Market Information',
//       hasSubsections: true,
//       data: drug?.marketInformation
//     },
//     {
//       id: 2,
//       key: 'drugSubstance',
//       title: 'Drug Substance',
//       hasSubsections: true,
//       data: drug?.drugSubstance,
//       subsections: [
//         { key: 'physicalAndChemicalProperties', title: 'Physical And Chemical Properties' },
//         { key: 'processDevelopment', title: 'Process Development' },
//         { key: 'analyticalDevelopment', title: 'Analytical Development' }
//       ]
//     },
//     {
//       id: 3,
//       key: 'drugProduct',
//       title: 'Drug Product',
//       hasSubsections: true,
//       data: drug?.drugProduct?.information
//     },
//     {
//       id: 4,
//       key: 'references',
//       title: 'References',
//       hasSubsections: false,
//       data: drug?.references
//     }
//   ], [drug]);

//   // Auto-expand/collapse based on activeSection
//   useEffect(() => {
//     if (!activeSection) return;
    
//     const newOpen: Record<string, boolean> = {};
//     const parts = activeSection.replace('section-', '').split('-').map(Number);
    
//     if (parts.length >= 1) {
//       const sectionId = parts[0];
//       const section = sectionStructure.find(s => s.id === sectionId);
      
//       if (section && section.hasSubsections) {
//         newOpen[section.key] = true;
        
//         if (section.key === 'drugSubstance' && parts.length >= 2) {
//           const subSectionIdx = parts[1] - 1;
//           if (section.subsections && section.subsections[subSectionIdx]) {
//             const subKey = section.subsections[subSectionIdx].key;
//             newOpen[`${section.key}.${subKey}`] = true;
//           }
//         }
        
//         if (section.key !== 'drugSubstance' && parts.length >= 2) {
//           const subSectionIdx = parts[1] - 1;
//           if (section.data && isPlainObject(section.data)) {
//             const visibleChildren = Object.entries(section.data).filter(
//               ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//             );
            
//             if (visibleChildren[subSectionIdx]) {
//               const [subKey] = visibleChildren[subSectionIdx];
//               newOpen[`${section.key}.${subKey}`] = true;
//             }
//           }
//         }
//       }
//     }
    
//     // Replace state completely, closing all other sections
//     setOpenSections(newOpen);
//   }, [activeSection, sectionStructure]);

//   const scrollToSection = (sectionId: string) => {
//     onNavigate?.(sectionId);
    
//     const element = document.getElementById(sectionId);
//     if (element) {
//       element.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     }
//   };

//   const renderSubsections = (section: any, sectionData: any) => {
//     if (section.key === 'drugSubstance' && section.subsections) {
//       return section.subsections.map((subsection: any, i: number) => {
//         const subsectionId = `section-${section.id}-${i + 1}`;
//         const subsectionData = sectionData?.[subsection.key];
//         // Exact match only
//         const isActiveSubsection = activeSection === subsectionId;
        
//         if (!hasContent(subsectionData)) return null;

//         const childExpandable = isPlainObject(subsectionData) &&
//           Object.entries(subsectionData).some(([k, v]) => !/^\d+$/.test(k) && hasContent(v));

//         const visibleGrandChildren = childExpandable
//           ? Object.entries(subsectionData).filter(([k, v]) => !/^\d+$/.test(k) && hasContent(v))
//           : [];

//         return (
//           <div key={subsection.key} className="mb-1">
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 scrollToSection(subsectionId);
//               }}
//               className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
//                 isActiveSubsection ? 'bg-blue-500 text-white' : ''
//               }`}
//             >
//               <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
//                 {section.id}.{i + 1} {subsection.title}
//               </span>
//               {childExpandable && (
//                 <span 
//                   className={`${isActiveSubsection ? 'text-white' : 'text-gray-400'} text-xs`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setOpenSections(prev => ({ 
//                       ...prev, 
//                       [`${section.key}.${subsection.key}`]: !prev[`${section.key}.${subsection.key}`] 
//                     }));
//                   }}
//                 >
//                   {openSections[`${section.key}.${subsection.key}`] ? "▼" : "►"}
//                 </span>
//               )}
//             </div>

//             {childExpandable && openSections[`${section.key}.${subsection.key}`] && 
//              visibleGrandChildren.length > 0 && (
//               <div className="ml-4 mt-1">
//                 {visibleGrandChildren.map(([gcKey], j) => {
//                   const subSubsectionId = `section-${section.id}-${i + 1}-${j + 1}`;
//                   const isActiveSubSubsection = activeSection === subSubsectionId;

//                   return (
//                     <div
//                       key={gcKey}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         scrollToSection(subSubsectionId);
//                       }}
//                       className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer hover:bg-blue-50 ${
//                         isActiveSubSubsection ? 'bg-blue-500 text-white' : ''
//                       }`}
//                     >
//                       <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
//                         {section.id}.{i + 1}.{j + 1} {toTitleCase(gcKey)}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         );
//       });
//     } else {
//       if (!isPlainObject(sectionData)) return null;

//       const visibleChildren = Object.entries(sectionData).filter(
//         ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
//       );

//       return visibleChildren.map(([subKey], i) => {
//         const subsectionId = `section-${section.id}-${i + 1}`;
//         // Exact match only
//         const isActiveSubsection = activeSection === subsectionId;

//         return (
//           <div
//             key={subKey}
//             onClick={(e) => {
//               e.stopPropagation();
//               scrollToSection(subsectionId);
//             }}
//             className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
//               isActiveSubsection ? 'bg-blue-500 text-white' : ''
//             }`}
//           >
//             <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
//               {section.id}.{i + 1} {toTitleCase(subKey)}
//             </span>
//           </div>
//         );
//       });
//     }
//   };

//   return (
//     <div className="bg-white border border-gray-300 rounded-lg p-4 w-80 h-screen overflow-y-auto">
//       <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
//         CONTENTS
//       </h3>

//       {sectionStructure.map((section) => {
//         if (!hasContent(section.data) && section.key !== 'title_and_summary') return null;

//         const sectionId = `section-${section.id}`;
//         // Exact match only
//         const isActiveSection = activeSection === sectionId;
//         const expandable = section.hasSubsections && hasContent(section.data);

//         return (
//           <div key={section.key} className="mb-1">
//             <div
//               onClick={(e) => {
//                 e.stopPropagation();
//                 scrollToSection(sectionId);
//               }}
//               className={`flex justify-between items-center py-1 px-2 hover:bg-blue-50 rounded cursor-pointer text-sm ${
//                 isActiveSection ? 'bg-blue-500 text-white' : ''
//               }`}
//               role="button"
//               tabIndex={0}
//             >
//               <span className={isActiveSection ? 'text-white' : 'text-gray-800'}>
//                 {section.id}. {section.title}
//               </span>
//               {expandable && (
//                 <span 
//                   className={`${isActiveSection ? 'text-white' : 'text-gray-400'} text-xs`}
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     setOpenSections(prev => ({ ...prev, [section.key]: !prev[section.key] }));
//                   }}
//                 >
//                   {openSections[section.key] ? "▼" : "►"}
//                 </span>
//               )}
//             </div>

//             {expandable && openSections[section.key] && (
//               <div className="ml-4 mt-1">
//                 {renderSubsections(section, section.data)}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// };

// export default Table;


import React, { useState, useEffect, useMemo } from "react";

interface TableProps {
  drug: any;
  activeSection: string;
  onNavigate?: (sectionId: string) => void;
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

const Table: React.FC<TableProps> = ({ drug, activeSection, onNavigate }) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const hasContent = (val: any): boolean => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string" && val.trim() === "") return false;
    if (typeof val === "string" && val.toLowerCase() === "n/a") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    if (typeof val === "object" && !Array.isArray(val) && Object.keys(val).length === 0) return false;
    return true;
  };

  const isPlainObject = (val: any) =>
    typeof val === "object" && val !== null && !Array.isArray(val);

  const sectionStructure = useMemo(() => [
    {
      id: 0,
      key: 'title_and_summary',
      title: 'Title and Summary',
      hasSubsections: false
    },
    {
      id: 1,
      key: 'marketInformation',
      title: 'Market Information',
      hasSubsections: true,
      data: drug?.marketInformation
    },
    {
      id: 2,
      key: 'drugSubstance',
      title: 'Drug Substance',
      hasSubsections: true,
      data: drug?.drugSubstance,
      subsections: [
        { key: 'physicalAndChemicalProperties', title: 'Physical And Chemical Properties' },
        { key: 'processDevelopment', title: 'Process Development' },
        { key: 'analyticalDevelopment', title: 'Analytical Development' }
      ]
    },
    {
      id: 3,
      key: 'drugProduct',
      title: 'Drug Product',
      hasSubsections: true,
      data: drug?.drugProduct?.information
    },
    {
      id: 4,
      key: 'references',
      title: 'References',
      hasSubsections: false,
      data: drug?.references
    }
  ], [drug]);

  // Auto-expand/collapse based on activeSection
  useEffect(() => {
    if (!activeSection) return;
    
    const newOpen: Record<string, boolean> = {};
    const parts = activeSection.replace('section-', '').split('-').map(Number);
    
    if (parts.length >= 1) {
      const sectionId = parts[0];
      const section = sectionStructure.find(s => s.id === sectionId);
      
      if (section && section.hasSubsections) {
        newOpen[section.key] = true;
        
        if (section.key === 'drugSubstance' && parts.length >= 2) {
          const subSectionIdx = parts[1] - 1;
          if (section.subsections && section.subsections[subSectionIdx]) {
            const subKey = section.subsections[subSectionIdx].key;
            newOpen[`${section.key}.${subKey}`] = true;
          }
        }
        
        if (section.key !== 'drugSubstance' && parts.length >= 2) {
          const subSectionIdx = parts[1] - 1;
          if (section.data && isPlainObject(section.data)) {
            const visibleChildren = Object.entries(section.data).filter(
              ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
            );
            
            if (visibleChildren[subSectionIdx]) {
              const [subKey] = visibleChildren[subSectionIdx];
              newOpen[`${section.key}.${subKey}`] = true;
            }
          }
        }
      }
    }
    
    // Replace state completely, closing all other sections
    setOpenSections(newOpen);
  }, [activeSection, sectionStructure]);

  const scrollToSection = (sectionId: string) => {
    onNavigate?.(sectionId);
    
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const renderSubsections = (section: any, sectionData: any) => {
    if (section.key === 'drugSubstance' && section.subsections) {
      return section.subsections.map((subsection: any, i: number) => {
        const subsectionId = `section-${section.id}-${i + 1}`;
        const subsectionData = sectionData?.[subsection.key];
        // Exact match only
        const isActiveSubsection = activeSection === subsectionId;
        
        if (!hasContent(subsectionData)) return null;

        const childExpandable = isPlainObject(subsectionData) &&
          Object.entries(subsectionData).some(([k, v]) => !/^\d+$/.test(k) && hasContent(v));

        const visibleGrandChildren = childExpandable
          ? Object.entries(subsectionData).filter(([k, v]) => !/^\d+$/.test(k) && hasContent(v))
          : [];

        return (
          <div key={subsection.key} className="mb-1">
            <div
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(subsectionId);
              }}
              className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
                isActiveSubsection ? 'bg-blue-500 text-white' : ''
              }`}
            >
              <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
                {section.id}.{i + 1} {subsection.title}
              </span>
              {childExpandable && (
                <span 
                  className={`${isActiveSubsection ? 'text-white' : 'text-gray-400'} text-xs`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSections(prev => ({ 
                      ...prev, 
                      [`${section.key}.${subsection.key}`]: !prev[`${section.key}.${subsection.key}`] 
                    }));
                  }}
                >
                  {openSections[`${section.key}.${subsection.key}`] ? "▼" : "►"}
                </span>
              )}
            </div>

            {childExpandable && openSections[`${section.key}.${subsection.key}`] && 
             visibleGrandChildren.length > 0 && (
              <div className="ml-4 mt-1">
                {visibleGrandChildren.map(([gcKey], j) => {
                  const subSubsectionId = `section-${section.id}-${i + 1}-${j + 1}`;
                  const isActiveSubSubsection = activeSection === subSubsectionId;

                  return (
                    <div
                      key={gcKey}
                      onClick={(e) => {
                        e.stopPropagation();
                        scrollToSection(subSubsectionId);
                      }}
                      className={`flex justify-between items-center py-1 px-2 rounded text-sm cursor-pointer ${
                        isActiveSubSubsection ? 'bg-blue-500 text-white' : ''
                      }`}
                    >
                      <span className={isActiveSubSubsection ? 'text-white' : 'text-gray-800'}>
                        {section.id}.{i + 1}.{j + 1} {toTitleCase(gcKey)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      });
    } else {
      if (!isPlainObject(sectionData)) return null;

      const visibleChildren = Object.entries(sectionData).filter(
        ([k, v]) => !/^\d+$/.test(k) && hasContent(v)
      );

      return visibleChildren.map(([subKey], i) => {
        const subsectionId = `section-${section.id}-${i + 1}`;
        // Exact match only
        const isActiveSubsection = activeSection === subsectionId;

        return (
          <div
            key={subKey}
            onClick={(e) => {
              e.stopPropagation();
              scrollToSection(subsectionId);
            }}
            className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
              isActiveSubsection ? 'bg-blue-500 text-white' : ''
            }`}
          >
            <span className={isActiveSubsection ? 'text-white' : 'text-gray-800'}>
              {section.id}.{i + 1} {toTitleCase(subKey)}
            </span>
          </div>
        );
      });
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 w-80 h-screen overflow-y-auto">
      <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">
        CONTENTS
      </h3>

      {sectionStructure.map((section) => {
        if (!hasContent(section.data) && section.key !== 'title_and_summary') return null;

        const sectionId = `section-${section.id}`;
        // Exact match only
        const isActiveSection = activeSection === sectionId;
        const expandable = section.hasSubsections && hasContent(section.data);

        return (
          <div key={section.key} className="mb-1">
            <div
              onClick={(e) => {
                e.stopPropagation();
                scrollToSection(sectionId);
              }}
              className={`flex justify-between items-center py-1 px-2 rounded cursor-pointer text-sm ${
                isActiveSection ? 'bg-blue-500 text-white' : ''
              }`}
              role="button"
              tabIndex={0}
            >
              <span className={isActiveSection ? 'text-white' : 'text-gray-800'}>
                {section.id}. {section.title}
              </span>
              {expandable && (
                <span 
                  className={`${isActiveSection ? 'text-white' : 'text-gray-400'} text-xs`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenSections(prev => ({ ...prev, [section.key]: !prev[section.key] }));
                  }}
                >
                  {openSections[section.key] ? "▼" : "►"}
                </span>
              )}
            </div>

            {expandable && openSections[section.key] && (
              <div className="ml-4 mt-1">
                {renderSubsections(section, section.data)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Table;






