import React from 'react';


interface RightContentProps {
  sections: any[];
  renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
  activeId: string;
  recordTitle?: string;
}


const RightContent: React.FC<RightContentProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
  return (
    <aside className="hidden md:block w-72 text-black">
      <div className="sticky top-24 bg-white border border-blue-200 rounded p-0 max-h-[80vh] overflow-y-auto shadow-sm text-black">
        <div className="font-semibold text-black px-4 pt-4 pb-2 text-[15px]">CONTENTS</div>
        <ul className="text-[13px] text-black">
          <li>
            <button
              className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 transition-colors ${activeId === 'summary' ? 'font-bold text-black bg-blue-100' : 'text-black'}`}
              style={{ background: 'none', color: 'black', outline: 'none' }}
              onClick={() => {
                const el = document.getElementById('summary');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {recordTitle ? recordTitle : 'Title and Summary'}
            </button>
          </li>
        </ul>
        <div className="mt-1 px-2 pb-2 text-black">{renderTOC(sections)}</div>
        <hr className="mt-2 mb-0 border-blue-100" />
      </div>
    </aside>
  );
};

export default RightContent;




