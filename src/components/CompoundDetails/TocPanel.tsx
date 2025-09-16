

//corrected code

// import React from 'react';

// interface TocPanelProps {
//   sections: any[];
//   renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
//   activeId: string;
//   recordTitle?: string;
// }

// const TocPanel: React.FC<TocPanelProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
//   return (
//     <aside className="w-full sticky top-20 h-[calc(100vh-80px)] overflow-y-auto bg-white border border-blue-200 rounded p-2 shadow-sm">
//       {/* TOC Header */}
//       <div className="font-semibold text-black px-2 pt-2 pb-2 text-[15px] sticky top-0 bg-white z-10 border-b border-blue-100">
//         CONTENTS
//       </div>

//       {/* Title & Summary */}
//       <ul className="text-[13px] text-black mt-2">
//         <li>
//           <div
//             className={`flex items-center group rounded transition-colors ${
//               activeId === 'summary' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
//             }`}
//           >
//             <button
//               className="w-full text-left px-2 py-1 rounded hover:bg-blue-400 transition-colors"
//               style={{ outline: 'none' }}
//               onClick={() => {
//                 const el = document.getElementById('summary');
//                 if (el) {
//                   el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//                   setTimeout(() => {
//                     const event = new CustomEvent('setActiveId', { detail: 'summary' });
//                     window.dispatchEvent(event);
//                   }, 100);
//                 }
//               }}
//             >
//               <span className="align-middle min-h-[22px]">Title and Summary</span>
//               {recordTitle && <span className="sr-only">{recordTitle}</span>}
//             </button>
//           </div>
//         </li>
//       </ul>

//       {/* Sections */}
//       <div className="mt-2">{renderTOC(sections)}</div>

//       <hr className="mt-2 border-blue-100" />
//     </aside>
//   );
// };

// export default TocPanel;


import React, { useRef, useEffect } from 'react';

interface TocPanelProps {
  sections: any[];
  renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
  activeId: string;
  recordTitle?: string;
}

const TocPanel: React.FC<TocPanelProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLDivElement | null>(null);

  // Scroll active item into view automatically
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeItem = activeItemRef.current;

      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // If active item is hidden below or above, scroll it into view (align near top)
      if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        container.scrollTo({
          top:
            container.scrollTop +
            (itemRect.top - containerRect.top) -
            40, // offset for padding
          behavior: 'smooth',
        });
      }
    }
  }, [activeId]);

  return (
    <aside
      ref={containerRef}
      className="w-full sticky top-20 h-[calc(100vh-80px)] overflow-y-auto bg-white border border-blue-200 rounded p-2 shadow-sm"
    >
      {/* TOC Header */}
      <div className="font-semibold text-black px-2 pt-2 pb-2 text-[15px] sticky top-0 bg-white z-10 border-b border-blue-100">
        CONTENTS
      </div>

      {/* Title & Summary */}
      <ul className="text-[13px] text-black mt-2">
        <li>
          <div
            className={`flex items-center group rounded transition-colors ${
              activeId === 'summary' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-black'
            }`}
          >
            <button
              className="w-full text-left px-2 py-1 rounded hover:bg-blue-400 transition-colors"
              style={{ outline: 'none' }}
              onClick={() => {
                const el = document.getElementById('summary');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  setTimeout(() => {
                    const event = new CustomEvent('setActiveId', { detail: 'summary' });
                    window.dispatchEvent(event);
                  }, 100);
                }
              }}
            >
              <span className="align-middle min-h-[22px]">Title and Summary</span>
              {recordTitle && <span className="sr-only">{recordTitle}</span>}
            </button>
          </div>
        </li>
      </ul>

      {/* Sections */}
      <div className="mt-2">
        {renderTOC(
          sections,
          1,
          '',
        )}
      </div>

      <hr className="mt-2 border-blue-100" />
    </aside>
  );
};

export default TocPanel;

