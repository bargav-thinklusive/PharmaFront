// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { maindata } from '../sampleData/data';
// import LeftColumn from './LeftColumn';
// import RightColumn from './RightColumn';

// const CompoundDetailsPage: React.FC = () => {
//   const { ccategory, cid } = useParams();
//   type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
//   const main: MainDataType = maindata[0] || {};
//   let categoryArr: any[] = [];
//   if (ccategory === 'compound') categoryArr = main.Compound || [];
//   else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
//   else if (ccategory === 'genre') categoryArr = main.Genre || [];
//   const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));
//   if (!item) return <div className="p-8 text-center text-red-600 text-xl">No data found for this {ccategory} with CID {cid}.</div>;

//   function renderInfo(info: any) {
//     if (!info) return null;
//     if (info.Value?.StringWithMarkup) return info.Value.StringWithMarkup.map((sm: any, i: number) => <div key={i}>{sm.String}</div>);
//     if (info.Value?.Number) return <div>{info.Value.Number.join(', ')}</div>;
//     if (info.Value?.Boolean) return <div>{info.Value.Boolean.map((b: boolean) => b ? 'Yes' : 'No').join(', ')}</div>;
//     if (info.Value?.DateISO8601) return <div>{info.Value.DateISO8601.join(', ')}</div>;
//     if (info.Value?.Unit) return <div>{info.Value.Unit}</div>;
//     if (info.Value?.ExternalTableName) return <div>{info.Value.ExternalTableName}</div>;
//     return null;
//   }

//   function renderSection(section: any, level = 2, sectionNum = '') {
//     if (!section) return null;
//     const tagName = `h${Math.min(level, 6)}`;
//     const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//     const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;
//     return (
//       <div id={htmlId} ref={el => { if (el) sectionRefs.current[htmlId] = el; }} className="mb-6 text-black scroll-mt-24">
//         <div className="border-b-4 border-blue-300 flex items-center mb-2">
//           {React.createElement(tagName, { className: `font-bold text-black py-1 pl-1 mb-0 ${level === 2 ? 'text-2xl' : level === 3 ? 'text-lg' : 'text-base'}` }, `${sectionNum} ${section.TOCHeading}`)}
//         </div>
//         {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
//         {section.Information && section.Information.map((info: any, i: number) => (<div key={i} className="mb-1 text-black">{renderInfo(info)}</div>))}
//         {Array.isArray(section.Section) && section.Section.map((sub: any, i: number) => (<div key={i} className="ml-4 border-l-2 border-blue-100 pl-4 text-black">{renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}</div>))}
//       </div>
//     );
//   }

//   const sections = item.Record.Section || [];
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
//     const state: { [key: string]: boolean } = {};
//     sections.forEach((section: any, idx: number) => { const sectionId = `${idx + 1}`; const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase(); const htmlId = `${sectionId}-${normalized}`; state[htmlId] = false; });
//     return state;
//   });
//   const [activeId, setActiveId] = useState<string>('summary');
//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   useEffect(() => {
//     const observer = new window.IntersectionObserver((entries) => {
//       const visible = entries.filter(e => e.isIntersecting);
//       if (visible.length > 0) { const vid = visible[0].target.id; setActiveId(vid); }
//     }, { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 });
//     Object.values(sectionRefs.current).forEach((el) => { if (el) observer.observe(el); });
//     return () => observer.disconnect();
//   }, [sections]);

//   // Listen for manual activeId changes from TOC clicks
//   useEffect(() => {
//     const handleSetActiveId = (event: CustomEvent) => {
//       setActiveId(event.detail);
//     };
//     window.addEventListener('setActiveId', handleSetActiveId as EventListener);
//     return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
//   }, []);

//   function renderTOC(sections: any[], level = 1, parentIdx = ''): React.ReactNode {
//     return (
//       <ul className={`text-[13px] text-black bg-white ${level > 1 ? 'ml-4 mt-1 border-l border-blue-100 pl-2' : ''}`}>
//         {sections.map((section: any, idx: number) => {
//           const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//           const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//           const htmlId = `${sectionId}-${normalized}`;
//           const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
//           const isOpen = openDropdowns[htmlId] ?? false;
//           const isActive = activeId === htmlId || activeId.startsWith(sectionId + '.');
//           return (
//             <React.Fragment key={htmlId}>
//               <li>
//                 <div className={`flex items-center group rounded transition-colors ${isActive && level === 1 ? 'bg-blue-100' : level === 1 ? 'bg-blue-50' : ''}`}>
//                   <button className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 transition-colors ${isActive ? 'font-bold text-black' : 'text-black'}`} style={{ background: 'none', color: 'black', outline: 'none' }} onClick={() => { const el = document.getElementById(htmlId); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); if (hasSub) setOpenDropdowns((o: any) => ({ ...o, [htmlId]: !isOpen })); }}>
//                     <span className="inline-block w-10 font-semibold text-black">{sectionId}</span>
//                     <span className="text-black">{section.TOCHeading}</span>
//                   </button>
//                   {hasSub && level === 1 && (
//                     <button className="ml-1 px-1 py-1 text-xs text-black hover:bg-blue-200 rounded transition-colors flex items-center bg-white" style={{ outline: 'none', background: 'white', color: 'black' }} onClick={() => setOpenDropdowns((o: any) => ({ ...o, [htmlId]: !isOpen }))} tabIndex={-1} aria-label={isOpen ? 'Collapse section' : 'Expand section'}>
//                       <span className="inline-block align-middle" style={{ fontSize: '12px' }}>{isOpen ? '▼' : '▶'}</span>
//                     </button>
//                   )}
//                 </div>
//                 {hasSub && isOpen && (
//                   <div className="bg-white">{renderTOC(section.Section, level + 1, sectionId)}</div>
//                 )}
//               </li>
//               {level === 1 && idx !== sections.length - 1 && (<li><hr className="border-blue-100 my-0.5" /></li>)}
//             </React.Fragment>
//           );
//         })}
//       </ul>
//     );
//   }

//   return (
//     <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
//       <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4 text-black">
//         <LeftColumn item={item} sections={sections} renderSection={renderSection} activeId={activeId} setSummaryRef={(el) => { if (el) sectionRefs.current['summary'] = el; }} />
//         <RightColumn sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={item.Record.RecordTitle} />
//       </div>
//     </div>
//   );
// };

// export default CompoundDetailsPage;



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { maindata } from '../sampleData/data';
// import LeftColumn from './LeftColumn';
// import RightColumn from './RightColumn';

// const CompoundDetailsPage: React.FC = () => {
//   const { ccategory, cid } = useParams();
//   type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
//   const main: MainDataType = maindata[0] || {};
  
//   let categoryArr: any[] = [];
//   if (ccategory === 'compound') categoryArr = main.Compound || [];
//   else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
//   else if (ccategory === 'genre') categoryArr = main.Genre || [];

//   const item = categoryArr.find(i => String(i.Record.RecordNumber) === String(cid));
//   if (!item) return <div className="p-8 text-center text-red-600 text-xl">No data found for this {ccategory} with CID {cid}.</div>;

//   const sections = item.Record.Section || [];

//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});
//   const [activeId, setActiveId] = useState<string>('summary');
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({});

//   // Initialize dropdown states
//   useEffect(() => {
//     const state: { [key: string]: boolean } = {};
//     const initDropdowns = (sections: any[], parentIdx = '') => {
//       sections.forEach((section: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         state[htmlId] = false;
//         if (section.Section) initDropdowns(section.Section, sectionId);
//       });
//     };
//     initDropdowns(sections);
//     setOpenDropdowns(state);
//   }, [sections]);

//   // IntersectionObserver for scrolling highlight
//   useEffect(() => {
//     const observer = new IntersectionObserver((entries) => {
//       const visible = entries.filter(e => e.isIntersecting);
//       if (visible.length > 0) {
//         const vid = visible[0].target.id;
//         setActiveId(vid);

//         // Open parent dropdowns automatically
//         setOpenDropdowns((prev) => {
//           const newState = { ...prev };
//           Object.keys(newState).forEach(key => {
//             if (vid.startsWith(key)) newState[key] = true;
//           });
//           return newState;
//         });
//       }
//     }, { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 });

//     Object.values(sectionRefs.current).forEach(el => { if (el) observer.observe(el); });
//     return () => observer.disconnect();
//   }, [sections]);

//   // Listen for manual activeId changes from TOC clicks
//   useEffect(() => {
//     const handleSetActiveId = (event: CustomEvent) => setActiveId(event.detail);
//     window.addEventListener('setActiveId', handleSetActiveId as EventListener);
//     return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
//   }, []);

//   // Render Section recursively
//   const renderSection = (section: any, level = 2, sectionNum = '') => {
//     if (!section) return null;
//     const tagName = `h${Math.min(level, 6)}`;
//     const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//     const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;

//     return (
//       <div
//         id={htmlId}
//         ref={el => { if (el) sectionRefs.current[htmlId] = el; }}
//         className="mb-6 text-black scroll-mt-24"
//       >
//         <div className="border-b-4 border-blue-300 flex items-center mb-2">
//           {React.createElement(tagName, {
//             className: `font-bold text-black py-1 pl-1 mb-0 ${level === 2 ? 'text-2xl' : level === 3 ? 'text-lg' : 'text-base'}`
//           }, `${sectionNum} ${section.TOCHeading}`)}
//         </div>
//         {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
//         {section.Information?.map((info: any, i: number) => (
//           <div key={i} className="mb-1 text-black">{info.Value?.StringWithMarkup?.map((sm: any, j: number) => <div key={j}>{sm.String}</div>)}</div>
//         ))}
//         {Array.isArray(section.Section) && section.Section.map((sub: any, i: number) => (
//           <div key={i} className="ml-4 border-l-2 border-blue-100 pl-4 text-black">
//             {renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   // Render TOC recursively
//   const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
//     <ul className={`text-[13px] text-black ${level > 1 ? 'ml-4 mt-1 border-l border-blue-100 pl-2' : ''}`}>
//       {sections.map((section: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
//         const isOpen = openDropdowns[htmlId] ?? false;
//         const isActive = activeId === htmlId || activeId.startsWith(sectionId + '.');

//         return (
//           <React.Fragment key={htmlId}>
//             <li>
//               <div className={`flex items-center group rounded transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'}`}>
//                 <button
//                   className="w-full text-left px-2 py-1 rounded hover:bg-blue-400 transition-colors"
//                   onClick={() => {
//                     const el = document.getElementById(htmlId);
//                     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });

//                     // Dispatch event to update activeId
//                     setTimeout(() => window.dispatchEvent(new CustomEvent('setActiveId', { detail: htmlId })), 100);
//                   }}
//                 >
//                   <span className="inline-block w-10 font-semibold">{sectionId}</span>
//                   {section.TOCHeading}
//                 </button>
//                 {hasSub && (
//                   <button
//                     className="ml-1 px-1 py-1 text-xs hover:bg-blue-200 rounded transition-colors"
//                     onClick={() => setOpenDropdowns(prev => ({ ...prev, [htmlId]: !isOpen }))}
//                     tabIndex={-1}
//                     aria-label={isOpen ? 'Collapse section' : 'Expand section'}
//                   >
//                     {isOpen ? '▼' : '▶'}
//                   </button>
//                 )}
//               </div>
//               {hasSub && isOpen && <div>{renderTOC(section.Section, level + 1, sectionId)}</div>}
//             </li>
//             {level === 1 && idx !== sections.length - 1 && <li><hr className="border-blue-100 my-0.5" /></li>}
//           </React.Fragment>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <div className="w-full flex flex-col md:flex-row gap-4 py-8 bg-white/80 text-black">
//       <LeftColumn item={item} sections={sections} renderSection={renderSection} activeId={activeId} setSummaryRef={el => { if (el) sectionRefs.current['summary'] = el; }} />
//       <RightColumn sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={item.Record.RecordTitle} />
//     </div>
//   );
// };

// export default CompoundDetailsPage;

//corrected code

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { maindata } from '../sampleData/data';
// import LeftColumn from './LeftColumn';
// import RightColumn from './RightColumn';

// const CompoundDetailsPage: React.FC = () => {
//   const { ccategory, cid } = useParams();
//   type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
//   const main: MainDataType = maindata[0] || {};

//   let categoryArr: any[] = [];
//   if (ccategory === 'compound') categoryArr = main.Compound || [];
//   else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
//   else if (ccategory === 'genre') categoryArr = main.Genre || [];

//   const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));
//   if (!item)
//     return (
//       <div className="p-8 text-center text-red-600 text-xl">
//         No data found for this {ccategory} with CID {cid}.
//       </div>
//     );

//   const sections = item.Record.Section || [];
//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   const [activeId, setActiveId] = useState<string>('summary');

//   // Initialize open dropdowns for all sections
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
//     const state: { [key: string]: boolean } = {};
//     const traverse = (secs: any[], parentIdx = '') => {
//       secs.forEach((sec: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (sec.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         state[htmlId] = false;
//         if (Array.isArray(sec.Section)) traverse(sec.Section, sectionId);
//       });
//     };
//     traverse(sections);
//     return state;
//   });

//   // Get all parent IDs for a given section
//   const getActivePath = (id: string) => {
//     const parts = id.split('-')[0].split('.');
//     const path: string[] = [];
//     let current = '';
//     for (let i = 0; i < parts.length; i++) {
//       current = i === 0 ? parts[i] : `${current}.${parts[i]}`;
//       const normalizedKey = Object.keys(openDropdowns).find((k) => k.startsWith(current));
//       if (normalizedKey) path.push(normalizedKey);
//     }
//     return path;
//   };

//   // Update dropdowns when activeId changes
//   useEffect(() => {
//     const path = getActivePath(activeId);
//     setOpenDropdowns((prev) => {
//       const newState: { [key: string]: boolean } = {};
//       Object.keys(prev).forEach((key) => {
//         newState[key] = path.includes(key); // open only parents of active section
//       });
//       return newState;
//     });
//   }, [activeId]);

//   // IntersectionObserver to track visible section
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visibleEntries = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

//         if (visibleEntries.length > 0) {
//           const topMostId = visibleEntries[0].target.id;
//           setActiveId(topMostId);
//         }
//       },
//       { rootMargin: '-20% 0px -70% 0px', threshold: 0.1 } // tweak margins for exact section detection
//     );

//     Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
//     return () => observer.disconnect();
//   }, [sections]);

//   // Listen for manual TOC clicks
//   useEffect(() => {
//     const handleSetActiveId = (event: CustomEvent) => setActiveId(event.detail);
//     window.addEventListener('setActiveId', handleSetActiveId as EventListener);
//     return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
//   }, []);

//   // Render section recursively
//   const renderSection = (section: any, level = 2, sectionNum = ''): React.ReactNode => {
//     if (!section) return null;
//     const tagName = `h${Math.min(level, 6)}`;
//     const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//     const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;

//     return (
//       <div
//         id={htmlId}
//         ref={(el) => {
//           if (el) sectionRefs.current[htmlId] = el;
//         }}
//         className="mb-6 text-black scroll-mt-24"
//       >
//         <div className="border-b-4 border-blue-300 flex items-center mb-2">
//           {React.createElement(
//             tagName,
//             { className: `font-bold text-black py-1 pl-1 mb-0 ${level === 2 ? 'text-2xl' : level === 3 ? 'text-lg' : 'text-base'}` },
//             `${sectionNum} ${section.TOCHeading}`
//           )}
//         </div>
//         {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
//         {section.Information &&
//           section.Information.map((info: any, i: number) => (
//             <div key={i} className="mb-1 text-black">
//               {info.Value?.StringWithMarkup
//                 ? info.Value.StringWithMarkup.map((sm: any, idx: number) => <div key={idx}>{sm.String}</div>)
//                 : info.Value?.Number
//                 ? info.Value.Number.join(', ')
//                 : info.Value?.Boolean
//                 ? info.Value.Boolean.map((b: boolean) => (b ? 'Yes' : 'No')).join(', ')
//                 : info.Value?.DateISO8601
//                 ? info.Value.DateISO8601.join(', ')
//                 : info.Value?.Unit
//                 ? info.Value.Unit
//                 : info.Value?.ExternalTableName
//                 ? info.Value.ExternalTableName
//                 : null}
//             </div>
//           ))}
//         {Array.isArray(section.Section) &&
//           section.Section.map((sub: any, i: number) => (
//             <div key={i} className="ml-4 border-l-2 border-blue-100 pl-4 text-black">
//               {renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}
//             </div>
//           ))}
//       </div>
//     );
//   };

//   // Recursive TOC renderer
//   const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
//     <ul className={`${level > 1 ? 'ml-4 border-l border-blue-100 pl-2 mt-1' : ''}`}>
//       {sections.map((section: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
//         const isOpen = openDropdowns[htmlId] ?? false;
//         const isActive = activeId === htmlId; // exact match only

//         return (
//           <li key={htmlId} id={`toc-${htmlId}`}>
//             <div
//               className={`flex items-center justify-between rounded transition-colors ${
//                 isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
//               }`}
//             >
//               <button
//                 className="w-full text-left px-2 py-1 hover:bg-blue-400 rounded transition-colors"
//                 onClick={() => {
//                   const el = document.getElementById(htmlId);
//                   if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                   setTimeout(() => window.dispatchEvent(new CustomEvent('setActiveId', { detail: htmlId })), 100);
//                 }}
//               >
//                 <span className="inline-block w-10 font-semibold">{sectionId}</span>
//                 {section.TOCHeading}
//               </button>

//               {hasSub && (
//                 <button
//                   className="ml-1 px-1 py-1 text-xs hover:bg-blue-200 rounded transition-colors"
//                   onClick={() => setOpenDropdowns((prev) => ({ ...prev, [htmlId]: !prev[htmlId] }))}
//                   tabIndex={-1}
//                   aria-label={isOpen ? 'Collapse' : 'Expand'}
//                 >
//                   {isOpen ? '▼' : '▶'}
//                 </button>
//               )}
//             </div>

//             {hasSub && isOpen && renderTOC(section.Section, level + 1, sectionId)}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
//       <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4">
//         <LeftColumn
//           item={item}
//           sections={sections}
//           renderSection={renderSection}
//           activeId={activeId}
//           setSummaryRef={(el) => {
//             if (el) sectionRefs.current['summary'] = el;
//           }}
//         />
//         <RightColumn sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={item.Record.RecordTitle} />
//       </div>
//     </div>
//   );
// };

// export default CompoundDetailsPage;


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { maindata } from '../sampleData/data';
// import LeftColumn from './LeftColumn';
// import RightColumn from './RightColumn';

// const CompoundDetailsPage: React.FC = () => {
//   const { ccategory, cid } = useParams();
//   type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
//   const main: MainDataType = maindata[0] || {};

//   let categoryArr: any[] = [];
//   if (ccategory === 'compound') categoryArr = main.Compound || [];
//   else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
//   else if (ccategory === 'genre') categoryArr = main.Genre || [];

//   const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));
//   if (!item)
//     return (
//       <div className="p-8 text-center text-red-600 text-xl">
//         No data found for this {ccategory} with CID {cid}.
//       </div>
//     );

//   const sections = item.Record.Section || [];
//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   const [activeId, setActiveId] = useState<string>('summary');

//   // Initialize open dropdowns for all sections
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
//     const state: { [key: string]: boolean } = {};
//     const traverse = (secs: any[], parentIdx = '') => {
//       secs.forEach((sec: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (sec.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         state[htmlId] = false;
//         if (Array.isArray(sec.Section)) traverse(sec.Section, sectionId);
//       });
//     };
//     traverse(sections);
//     return state;
//   });

//   // Get all parent IDs for a given section
//   const getActivePath = (id: string) => {
//     const parts = id.split('-')[0].split('.');
//     const path: string[] = [];
//     let current = '';
//     for (let i = 0; i < parts.length; i++) {
//       current = i === 0 ? parts[i] : `${current}.${parts[i]}`;
//       const normalizedKey = Object.keys(openDropdowns).find((k) => k.startsWith(current));
//       if (normalizedKey) path.push(normalizedKey);
//     }
//     return path;
//   };

//   // Update dropdowns when activeId changes
//   useEffect(() => {
//     const path = getActivePath(activeId);
//     setOpenDropdowns((prev) => {
//       const newState: { [key: string]: boolean } = {};
//       Object.keys(prev).forEach((key) => {
//         newState[key] = path.includes(key); // open only parents of active section
//       });
//       return newState;
//     });
//   }, [activeId]);

//   // IntersectionObserver to track visible section
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

//         if (visible.length > 0) {
//           const topMostId = visible[0].target.id;
//           setActiveId(topMostId);
//         }
//       },
//       {
//         rootMargin: '-30% 0px -30% 0px',
//         threshold: 0.25,
//       }
//     );

//     // Observe all sections
//     Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));

//     // Explicitly observe summary
//     const summaryEl = document.getElementById('summary');
//     if (summaryEl) observer.observe(summaryEl);

//     return () => observer.disconnect();
//   }, [sections]);

//   // Listen for manual TOC clicks
//   useEffect(() => {
//     const handleSetActiveId = (event: CustomEvent) => setActiveId(event.detail);
//     window.addEventListener('setActiveId', handleSetActiveId as EventListener);
//     return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
//   }, []);

//   // Render section recursively
//   const renderSection = (section: any, level = 2, sectionNum = ''): React.ReactNode => {
//     if (!section) return null;
//     const tagName = `h${Math.min(level, 6)}`;
//     const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//     const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;

//     return (
//       <div
//         id={htmlId}
//         ref={(el) => {
//           if (el) sectionRefs.current[htmlId] = el;
//         }}
//         className="mb-6 text-black scroll-mt-24"
//       >
//         <div className="border-b-4 border-blue-300 flex items-center mb-2">
//           {React.createElement(
//             tagName,
//             {
//               className: `font-bold text-black py-1 pl-1 mb-0 ${
//                 level === 2 ? 'text-2xl' : level === 3 ? 'text-lg' : 'text-base'
//               }`,
//             },
//             `${sectionNum} ${section.TOCHeading}`
//           )}
//         </div>
//         {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
//         {section.Information &&
//           section.Information.map((info: any, i: number) => (
//             <div key={i} className="mb-1 text-black">
//               {info.Value?.StringWithMarkup
//                 ? info.Value.StringWithMarkup.map((sm: any, idx: number) => <div key={idx}>{sm.String}</div>)
//                 : info.Value?.Number
//                 ? info.Value.Number.join(', ')
//                 : info.Value?.Boolean
//                 ? info.Value.Boolean.map((b: boolean) => (b ? 'Yes' : 'No')).join(', ')
//                 : info.Value?.DateISO8601
//                 ? info.Value.DateISO8601.join(', ')
//                 : info.Value?.Unit
//                 ? info.Value.Unit
//                 : info.Value?.ExternalTableName
//                 ? info.Value.ExternalTableName
//                 : null}
//             </div>
//           ))}
//         {Array.isArray(section.Section) &&
//           section.Section.map((sub: any, i: number) => (
//             <div key={i} className="ml-4 border-l-2 border-blue-100 pl-4 text-black">
//               {renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}
//             </div>
//           ))}
//       </div>
//     );
//   };

//   // Recursive TOC renderer
//   const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
//     <ul className={`${level > 1 ? 'ml-4 border-l border-blue-100 pl-2 mt-1' : ''}`}>
//       {sections.map((section: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
//         const isOpen = openDropdowns[htmlId] ?? false;
//         const isActive = activeId === htmlId;

//         return (
//           <li key={htmlId} id={`toc-${htmlId}`}>
//             <div
//               className={`flex items-center justify-between rounded transition-colors ${
//                 isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
//               }`}
//             >
//               <button
//                 className="w-full text-left px-2 py-1 hover:bg-blue-400 rounded transition-colors"
//                 onClick={() => {
//                   const el = document.getElementById(htmlId);
//                   if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                   setTimeout(() => window.dispatchEvent(new CustomEvent('setActiveId', { detail: htmlId })), 100);
//                 }}
//               >
//                 <span className="inline-block w-10 font-semibold">{sectionId}</span>
//                 {section.TOCHeading}
//               </button>

//               {hasSub && (
//                 <button
//                   className="ml-1 px-1 py-1 text-xs hover:bg-blue-200 rounded transition-colors"
//                   onClick={() => setOpenDropdowns((prev) => ({ ...prev, [htmlId]: !prev[htmlId] }))}
//                   tabIndex={-1}
//                   aria-label={isOpen ? 'Collapse' : 'Expand'}
//                 >
//                   {isOpen ? '▼' : '▶'}
//                 </button>
//               )}
//             </div>

//             {hasSub && isOpen && renderTOC(section.Section, level + 1, sectionId)}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
//       <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4">
//         <LeftColumn
//           item={item}
//           sections={sections}
//           renderSection={renderSection}
//           activeId={activeId}
//           setSummaryRef={(el) => {
//             if (el) sectionRefs.current['summary'] = el;
//           }}
//         />
//         <RightColumn
//           sections={sections}
//           renderTOC={renderTOC}
//           activeId={activeId}
//           recordTitle={item.Record.RecordTitle}
//         />
//       </div>
//     </div>
//   );
// };

// export default CompoundDetailsPage;


// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { maindata } from '../sampleData/data';
// import LeftColumn from './LeftColumn';
// import RightColumn from './RightColumn';

// const CompoundDetailsPage: React.FC = () => {
//   const { ccategory, cid } = useParams();
//   type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
//   const main: MainDataType = maindata[0] || {};

//   let categoryArr: any[] = [];
//   if (ccategory === 'compound') categoryArr = main.Compound || [];
//   else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
//   else if (ccategory === 'genre') categoryArr = main.Genre || [];

//   const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));
//   if (!item)
//     return (
//       <div className="p-8 text-center text-red-600 text-xl">
//         No data found for this {ccategory} with CID {cid}.
//       </div>
//     );

//   const sections = item.Record.Section || [];
//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   const [activeId, setActiveId] = useState<string>('summary');

//   // TOC scroll
//   const tocContainerRef = useRef<HTMLDivElement>(null);
//   const tocItemRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   // Initialize open dropdowns for all sections
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
//     const state: { [key: string]: boolean } = {};
//     const traverse = (secs: any[], parentIdx = '') => {
//       secs.forEach((sec: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (sec.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         state[htmlId] = false;
//         if (Array.isArray(sec.Section)) traverse(sec.Section, sectionId);
//       });
//     };
//     traverse(sections);
//     return state;
//   });

//   // Get all parent IDs for a given section
//   const getActivePath = (id: string) => {
//     const parts = id.split('-')[0].split('.');
//     const path: string[] = [];
//     let current = '';
//     for (let i = 0; i < parts.length; i++) {
//       current = i === 0 ? parts[i] : `${current}.${parts[i]}`;
//       const normalizedKey = Object.keys(openDropdowns).find((k) => k.startsWith(current));
//       if (normalizedKey) path.push(normalizedKey);
//     }
//     return path;
//   };

//   // Update dropdowns when activeId changes
//   useEffect(() => {
//     const path = getActivePath(activeId);
//     setOpenDropdowns((prev) => {
//       const newState: { [key: string]: boolean } = {};
//       Object.keys(prev).forEach((key) => {
//         newState[key] = path.includes(key);
//       });
//       return newState;
//     });
//   }, [activeId]);

//   // IntersectionObserver to track visible section
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

//         if (visible.length > 0) {
//           const topMostId = visible[0].target.id;
//           setActiveId(topMostId);
//         }
//       },
//       {
//         rootMargin: '-30% 0px -30% 0px',
//         threshold: 0.25,
//       }
//     );

//     Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));

//     const summaryEl = document.getElementById('summary');
//     if (summaryEl) observer.observe(summaryEl);

//     return () => observer.disconnect();
//   }, [sections]);

//   // Listen for manual TOC clicks
//   useEffect(() => {
//     const handleSetActiveId = (event: CustomEvent) => setActiveId(event.detail);
//     window.addEventListener('setActiveId', handleSetActiveId as EventListener);
//     return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
//   }, []);

//   // Scroll TOC to active item
//   useEffect(() => {
//     const activeEl = tocItemRefs.current[activeId];
//     const container = tocContainerRef.current;
//     if (activeEl && container) {
//       const containerRect = container.getBoundingClientRect();
//       const itemRect = activeEl.getBoundingClientRect();

//       if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
//         container.scrollTo({
//           top: container.scrollTop + (itemRect.top - containerRect.top) - 20,
//           behavior: 'smooth',
//         });
//       }
//     }
//   }, [activeId]);

//   // Render section recursively
//   const renderSection = (section: any, level = 2, sectionNum = ''): React.ReactNode => {
//     if (!section) return null;
//     const tagName = `h${Math.min(level, 6)}`;
//     const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//     const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;

//     return (
//       <div
//         id={htmlId}
//         ref={(el) => {
//           if (el) sectionRefs.current[htmlId] = el;
//         }}
//         className="mb-6 text-black scroll-mt-24"
//       >
//         <div className="border-b-4 border-blue-300 flex items-center mb-2">
//           {React.createElement(
//             tagName,
//             {
//               className: `font-bold text-black py-1 pl-1 mb-0 ${
//                 level === 2 ? 'text-2xl' : level === 3 ? 'text-lg' : 'text-base'
//               }`,
//             },
//             `${sectionNum} ${section.TOCHeading}`
//           )}
//         </div>
//         {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
//         {section.Information &&
//           section.Information.map((info: any, i: number) => (
//             <div key={i} className="mb-1 text-black">
//               {info.Value?.StringWithMarkup
//                 ? info.Value.StringWithMarkup.map((sm: any, idx: number) => <div key={idx}>{sm.String}</div>)
//                 : info.Value?.Number
//                 ? info.Value.Number.join(', ')
//                 : info.Value?.Boolean
//                 ? info.Value.Boolean.map((b: boolean) => (b ? 'Yes' : 'No')).join(', ')
//                 : info.Value?.DateISO8601
//                 ? info.Value.DateISO8601.join(', ')
//                 : info.Value?.Unit
//                 ? info.Value.Unit
//                 : info.Value?.ExternalTableName
//                 ? info.Value.ExternalTableName
//                 : null}
//             </div>
//           ))}
//         {Array.isArray(section.Section) &&
//           section.Section.map((sub: any, i: number) => (
//             <div key={i} className="ml-4 border-l-2 border-blue-100 pl-4 text-black">
//               {renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}
//             </div>
//           ))}
//       </div>
//     );
//   };

//   // Recursive TOC renderer
//   const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
//     <ul className={`${level > 1 ? 'ml-4 border-l border-blue-100 pl-2 mt-1' : ''}`}>
//       {sections.map((section: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
//         const isOpen = openDropdowns[htmlId] ?? false;
//         const isActive = activeId === htmlId;

//         return (
//           <li key={htmlId} id={`toc-${htmlId}`}>
//             <div
//               className={`flex items-center justify-between rounded transition-colors ${
//                 isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
//               }`}
//             >
//               <button
//                 ref={(el) => {
//                   if (el) tocItemRefs.current[htmlId] = el;
//                 }}
//                 className="w-full text-left px-2 py-1 hover:bg-blue-400 rounded transition-colors"
//                 onClick={() => {
//                   const el = document.getElementById(htmlId);
//                   if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                   setTimeout(() => window.dispatchEvent(new CustomEvent('setActiveId', { detail: htmlId })), 100);
//                 }}
//               >
//                 <span className="inline-block w-14 font-semibold">{sectionId}</span>
//                 {section.TOCHeading}
//               </button>

//               {hasSub && (
//                 <button
//                   className="ml-1 px-1 py-1 text-xs hover:bg-blue-200 rounded transition-colors"
//                   onClick={() => setOpenDropdowns((prev) => ({ ...prev, [htmlId]: !prev[htmlId] }))}
//                   tabIndex={-1}
//                   aria-label={isOpen ? 'Collapse' : 'Expand'}
//                 >
//                   {isOpen ? '▼' : '▶'}
//                 </button>
//               )}
//             </div>

//             {hasSub && isOpen && renderTOC(section.Section, level + 1, sectionId)}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
//       <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4">
//         <LeftColumn
//           item={item}
//           sections={sections}
//           renderSection={renderSection}
//           activeId={activeId}
//           setSummaryRef={(el) => {
//             if (el) sectionRefs.current['summary'] = el;
//           }}
//         />
//         <RightColumn
//           ref={tocContainerRef}
//           sections={sections}
//           renderTOC={renderTOC}
//           activeId={activeId}
//           recordTitle={item.Record.RecordTitle}
//         />
//       </div>
//     </div>
//   );
// };

// export default CompoundDetailsPage;



// import React, { useState, useEffect, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import { maindata } from '../sampleData/data';
// import LeftColumn from './LeftColumn';
// import RightColumn from './RightColumn';

// const CompoundDetailsPage: React.FC = () => {
//   const { ccategory, cid } = useParams();
//   type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
//   const main: MainDataType = maindata[0] || {};

//   let categoryArr: any[] = [];
//   if (ccategory === 'compound') categoryArr = main.Compound || [];
//   else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
//   else if (ccategory === 'genre') categoryArr = main.Genre || [];

//   const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));
//   if (!item)
//     return (
//       <div className="p-8 text-center text-red-600 text-xl">
//         No data found for this {ccategory} with CID {cid}.
//       </div>
//     );

//   const sections = item.Record.Section || [];
//   const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

//   const [activeId, setActiveId] = useState<string>('summary');

//   // Open dropdown state
//   const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
//     const state: { [key: string]: boolean } = {};
//     const traverse = (secs: any[], parentIdx = '') => {
//       secs.forEach((sec: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (sec.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         state[htmlId] = false;
//         if (Array.isArray(sec.Section)) traverse(sec.Section, sectionId);
//       });
//     };
//     traverse(sections);
//     return state;
//   });

//   // Get parent path for a given id
//   const getActivePath = (id: string) => {
//     const parts = id.split('-')[0].split('.');
//     const path: string[] = [];
//     let current = '';
//     for (let i = 0; i < parts.length; i++) {
//       current = i === 0 ? parts[i] : `${current}.${parts[i]}`;
//       const normalizedKey = Object.keys(openDropdowns).find((k) => k.startsWith(current));
//       if (normalizedKey) path.push(normalizedKey);
//     }
//     return path;
//   };

//   // Update dropdowns on activeId change
//   useEffect(() => {
//     const path = getActivePath(activeId);
//     setOpenDropdowns((prev) => {
//       const newState: { [key: string]: boolean } = {};
//       Object.keys(prev).forEach((key) => {
//         newState[key] = path.includes(key); // only parents open
//       });
//       return newState;
//     });
//   }, [activeId]);

//   // IntersectionObserver to track visible sections
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         const visible = entries
//           .filter((e) => e.isIntersecting)
//           .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

//         if (visible.length > 0) {
//           const topMostId = visible[0].target.id;
//           setActiveId(topMostId);
//         }
//       },
//       { rootMargin: '-30% 0px -30% 0px', threshold: 0.25 }
//     );

//     Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
//     const summaryEl = document.getElementById('summary');
//     if (summaryEl) observer.observe(summaryEl);

//     return () => observer.disconnect();
//   }, [sections]);

//   // Listen for manual TOC clicks
//   useEffect(() => {
//     const handleSetActiveId = (event: CustomEvent) => setActiveId(event.detail);
//     window.addEventListener('setActiveId', handleSetActiveId as EventListener);
//     return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
//   }, []);

//   // Recursive section renderer
//   const renderSection = (section: any, level = 2, sectionNum = ''): React.ReactNode => {
//     if (!section) return null;
//     const tagName = `h${Math.min(level, 6)}`;
//     const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//     const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;
  
//     // Font sizes based on level
//     const fontSize = level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg';
  
//     return (
//       <div
//         id={htmlId}
//         ref={(el) => {
//           if (el) sectionRefs.current[htmlId] = el;
//         }}
//         className="mb-6 text-black scroll-mt-24"
//       >
//         {/* Heading with underline */}
//         <div className={`border-b-2 border-blue-300 flex items-center mb-2`}>
//           {React.createElement(
//             tagName,
//             { className: `font-bold py-1 pl-1 mb-0 ${fontSize}` },
//             `${sectionNum} ${section.TOCHeading}`
//           )}
//         </div>
  
//         {/* Description */}
//         {section.Description && (
//           <div className="text-black text-sm mb-2">{section.Description}</div>
//         )}
  
//         {/* Information */}
//         {section.Information &&
//           section.Information.map((info: any, i: number) => (
//             <div key={i} className="mb-1 text-black">
//               {info.Value?.StringWithMarkup
//                 ? info.Value.StringWithMarkup.map((sm: any, idx: number) => (
//                     <div key={idx}>{sm.String}</div>
//                   ))
//                 : info.Value?.Number
//                 ? info.Value.Number.join(', ')
//                 : info.Value?.Boolean
//                 ? info.Value.Boolean.map((b: boolean) => (b ? 'Yes' : 'No')).join(', ')
//                 : info.Value?.DateISO8601
//                 ? info.Value.DateISO8601.join(', ')
//                 : info.Value?.Unit
//                 ? info.Value.Unit
//                 : info.Value?.ExternalTableName
//                 ? info.Value.ExternalTableName
//                 : null}
//             </div>
//           ))}
  
//         {/* Subsections */}
//         {Array.isArray(section.Section) &&
//           section.Section.map((sub: any, i: number) => (
//             <div key={i} className="ml-4 text-black">
//               {renderSection(
//                 sub,
//                 level + 1,
//                 sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`
//               )}
//             </div>
//           ))}
//       </div>
//     );
//   };
  

//   // Recursive TOC renderer
//   const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
//     <ul className={`${level > 1 ? 'ml-4 mt-1' : ''}`}>
//       {sections.map((section: any, idx: number) => {
//         const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
//         const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
//         const htmlId = `${sectionId}-${normalized}`;
//         const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
//         const isOpen = openDropdowns[htmlId] ?? false;
//         const isActive = activeId === htmlId;

//         // Font size based on level
//         const fontSize =
//           level === 1 ? 'text-base' : level === 2 ? 'text-sm' : 'text-xs';

//         return (
//           <li key={htmlId} id={`toc-${htmlId}`} className="mb-1">
//             <div
//               className={`flex items-center justify-between rounded transition-colors ${
//                 isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
//               }`}
//             >
//               <button
//                 className={`w-full text-left px-2 py-1 hover:bg-blue-400 rounded transition-colors ${fontSize}`}
//                 onClick={() => {
//                   const el = document.getElementById(htmlId);
//                   if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                   setTimeout(
//                     () =>
//                       window.dispatchEvent(
//                         new CustomEvent('setActiveId', { detail: htmlId })
//                       ),
//                     100
//                   );
//                 }}
//               >
//                 <span className="inline-block w-12 font-semibold">{sectionId}</span>
//                 {section.TOCHeading}
//               </button>

//               {hasSub && (
//                 <button
//                   className="ml-1 px-1 py-1 text-xs hover:bg-blue-200 rounded transition-colors"
//                   onClick={() =>
//                     setOpenDropdowns((prev) => ({ ...prev, [htmlId]: !prev[htmlId] }))
//                   }
//                   tabIndex={-1}
//                   aria-label={isOpen ? 'Collapse' : 'Expand'}
//                 >
//                   {isOpen ? '▼' : '▶'}
//                 </button>
//               )}
//             </div>

//             {hasSub && isOpen && renderTOC(section.Section, level + 1, sectionId)}
//           </li>
//         );
//       })}
//     </ul>
//   );

//   return (
//     <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
//       <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4">
//         <LeftColumn
//           item={item}
//           sections={sections}
//           renderSection={renderSection}
//           activeId={activeId}
//           setSummaryRef={(el) => {
//             if (el) sectionRefs.current['summary'] = el;
//           }}
//         />
//         <RightColumn
//           sections={sections}
//           renderTOC={renderTOC}
//           activeId={activeId}
//           recordTitle={item.Record.RecordTitle}
//         />
//       </div>
//     </div>
//   );
// };

// export default CompoundDetailsPage;

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { maindata } from '../../sampleData/data';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';

const CompoundDetailsPage: React.FC = () => {
  const { ccategory, cid } = useParams();
  type MainDataType = { Compound?: any[]; Taxonomy?: any[]; Genre?: any[] };
  const main: MainDataType = maindata[0] || {};

  let categoryArr: any[] = [];
  if (ccategory === 'compound') categoryArr = main.Compound || [];
  else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
  else if (ccategory === 'genre') categoryArr = main.Genre || [];

  const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));
  if (!item)
    return (
      <div className="p-8 text-center text-red-600 text-xl">
        No data found for this {ccategory} with CID {cid}.
      </div>
    );

  const sections = item.Record.Section || [];
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  const [activeId, setActiveId] = useState<string>('summary');
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
    const state: { [key: string]: boolean } = {};
    const traverse = (secs: any[], parentIdx = '') => {
      secs.forEach((sec: any, idx: number) => {
        const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
        const normalized = (sec.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
        const htmlId = `${sectionId}-${normalized}`;
        state[htmlId] = false;
        if (Array.isArray(sec.Section)) traverse(sec.Section, sectionId);
      });
    };
    traverse(sections);
    return state;
  });

  // Open parent sections of active section
  const getActivePath = (id: string) => {
    const parts = id.split('-')[0].split('.');
    const path: string[] = [];
    let current = '';
    for (let i = 0; i < parts.length; i++) {
      current = i === 0 ? parts[i] : `${current}.${parts[i]}`;
      const normalizedKey = Object.keys(openDropdowns).find((k) => k.startsWith(current));
      if (normalizedKey) path.push(normalizedKey);
    }
    return path;
  };

  useEffect(() => {
    const path = getActivePath(activeId);
    setOpenDropdowns((prev) => {
      const newState: { [key: string]: boolean } = {};
      Object.keys(prev).forEach((key) => {
        newState[key] = path.includes(key);
      });
      return newState;
    });
  }, [activeId]);

  // IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0.25 }
    );

    Object.values(sectionRefs.current).forEach((el) => el && observer.observe(el));
    const summaryEl = document.getElementById('summary');
    if (summaryEl) observer.observe(summaryEl);

    return () => observer.disconnect();
  }, [sections]);

  // Listen for TOC clicks
  useEffect(() => {
    const handleSetActiveId = (event: CustomEvent) => setActiveId(event.detail);
    window.addEventListener('setActiveId', handleSetActiveId as EventListener);
    return () => window.removeEventListener('setActiveId', handleSetActiveId as EventListener);
  }, []);

  // Render sections
  const renderSection = (section: any, level = 2, sectionNum = ''): React.ReactNode => {
    if (!section) return null;
    const tagName = `h${Math.min(level, 6)}`;
    const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
    const htmlId = sectionNum ? `${sectionNum}-${normalized}` : normalized;

    return (
      <div
        id={htmlId}
        ref={(el) => {
          if (el) sectionRefs.current[htmlId] = el;
        }}
        className="mb-6 text-black scroll-mt-24"
      >
        <div className="border-b-2 border-blue-300 flex items-center mb-2">
          {React.createElement(
            tagName,
            {
              className: `font-bold text-black py-1 pl-1 mb-0 ${
                level === 2 ? 'text-xl' : level === 3 ? 'text-lg' : 'text-base'
              }`,
            },
            `${sectionNum} ${section.TOCHeading}`
          )}
        </div>
        {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
        {section.Information &&
          section.Information.map((info: any, i: number) => (
            <div key={i} className="mb-1 text-black">
              {info.Value?.StringWithMarkup
                ? info.Value.StringWithMarkup.map((sm: any, idx: number) => <div key={idx}>{sm.String}</div>)
                : info.Value?.Number
                ? info.Value.Number.join(', ')
                : info.Value?.Boolean
                ? info.Value.Boolean.map((b: boolean) => (b ? 'Yes' : 'No')).join(', ')
                : info.Value?.DateISO8601
                ? info.Value.DateISO8601.join(', ')
                : info.Value?.Unit
                ? info.Value.Unit
                : info.Value?.ExternalTableName
                ? info.Value.ExternalTableName
                : null}
            </div>
          ))}
        {Array.isArray(section.Section) &&
          section.Section.map((sub: any, i: number) => (
            <div key={i} className="ml-4 pl-4 text-black">
              {renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}
            </div>
          ))}
      </div>
    );
  };

  // Render TOC
  const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
    <ul className="list-none m-0 p-0">
      {sections.map((section: any, idx: number) => {
        const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
        const normalized = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
        const htmlId = `${sectionId}-${normalized}`;
        const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
        const isOpen = openDropdowns[htmlId] ?? false;
        const isActive = activeId === htmlId;

        return (
          <li key={htmlId} id={`toc-${htmlId}`} className="mb-1">
            <div
              className={`flex justify-between items-center rounded transition-colors ${
                isActive ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
              }`}
            >
              <button
                className={`w-full text-left px-2 py-0.5 rounded transition-colors ${
                  level === 1 ? 'text-sm ' : level === 2 ? 'text-xs font-medium' : 'text-[11px]'
                }`}
                onClick={() => {
                  const el = document.getElementById(htmlId);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => window.dispatchEvent(new CustomEvent('setActiveId', { detail: htmlId })), 100);
                }}
              >
                <span className="inline-block w-12">{sectionId}</span>
                {section.TOCHeading}
              </button>

              {hasSub && (
                <button
                  className="ml-1 px-1 py-1 text-xs hover:bg-blue-200 rounded transition-colors"
                  onClick={() => setOpenDropdowns((prev) => ({ ...prev, [htmlId]: !prev[htmlId] }))}
                  tabIndex={-1}
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                >
                  {isOpen ? '▼' : '▶'}
                </button>
              )}
            </div>

            {hasSub && isOpen && renderTOC(section.Section, level + 1, sectionId)}
          </li>
        );
      })}
    </ul>
  );

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
      <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4">
        <LeftPanel
          item={item}
          sections={sections}
          renderSection={renderSection}
          activeId={activeId}
          setSummaryRef={(el) => {
            if (el) sectionRefs.current['summary'] = el;
          }}
        />
        <RightPanel sections={sections} renderTOC={renderTOC} activeId={activeId} recordTitle={item.Record.RecordTitle} />
      </div>
    </div>
  );
};

export default CompoundDetailsPage;
