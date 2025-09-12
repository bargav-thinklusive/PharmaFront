import React from 'react';

interface TocPanelProps {
  sections: any[];
  renderTOC: (sections: any[], level?: number, parentIdx?: string) => React.ReactNode;
  activeId: string;
  recordTitle?: string;
}

const TocPanel: React.FC<TocPanelProps> = ({ sections, renderTOC, activeId, recordTitle }) => {
  return (
    <aside className="hidden md:block w-72 text-black">
      <div className="fixed top-1/2 right-8 transform -translate-y-1/2 bg-white border border-blue-200 rounded p-0 h-[70vh] overflow-y-auto shadow-sm text-black z-50">
        <div className="font-semibold text-black px-4 pt-4 pb-2 text-[15px] sticky top-0 bg-white z-10">CONTENTS</div>
        <div className="overflow-y-auto max-h-[calc(70vh-60px)]">
          <ul className="text-[13px] text-black">
            <li>
              <div className={`flex items-center group rounded transition-colors ${activeId === 'summary' ? 'bg-blue-500' : 'bg-blue-50'}`}>
                <button
                  className={`w-full text-left px-2 py-1 rounded hover:bg-blue-500 transition-colors cursor-pointer ${activeId === 'summary' ? 'font-bold text-white' : 'text-black'}`}
                  style={{ background: 'none', color: activeId === 'summary' ? 'white' : 'black', outline: 'none' }}
                  onClick={() => {
                    const el = document.getElementById('summary');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      // Temporarily set activeId to summary to ensure proper highlighting
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
          <div className="mt-1 px-2 pb-2 text-black">{renderTOC(sections)}</div>
          <hr className="mt-2 mb-0 border-blue-100" />
        </div>
      </div>
    </aside>
  );
};

export default TocPanel;
