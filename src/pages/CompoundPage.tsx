import React, { useState, useEffect, useRef } from 'react';
import CompoundSummary from './CompoundSummary';

import { useParams } from 'react-router-dom';
import { maindata } from '../sampleData/data';
import LeftContent from './LeftContent';
import RightContent from './RightContent';

const CompoundPage: React.FC = () => {
  const { ccategory, cid } = useParams();
  // Get the correct category array from maindata
  type MainDataType = {
    Compound?: any[];
    Taxonomy?: any[];
    Genre?: any[];
  };
  const main: MainDataType = maindata[0] || {};
  let categoryArr: any[] = [];
  if (ccategory === 'compound') categoryArr = main.Compound || [];
  else if (ccategory === 'taxonomy') categoryArr = main.Taxonomy || [];
  else if (ccategory === 'genre') categoryArr = main.Genre || [];

  // Find the item by RecordNumber (cid)
  const item = categoryArr.find((i) => String(i.Record.RecordNumber) === String(cid));

  if (!item) {
    return <div className="p-8 text-center text-red-600 text-xl">No data found for this {ccategory} with CID {cid}.</div>;
  }

  // Helper to render Information values
  function renderInfo(info: any) {
    if (!info) return null;
    if (info.Value?.StringWithMarkup) {
      return info.Value.StringWithMarkup.map((sm: any, i: number) => (
        <div key={i}>{sm.String}</div>
      ));
    }
    if (info.Value?.Number) {
      return <div>{info.Value.Number.join(', ')}</div>;
    }
    if (info.Value?.Boolean) {
      return <div>{info.Value.Boolean.map((b: boolean) => b ? 'Yes' : 'No').join(', ')}</div>;
    }
    if (info.Value?.DateISO8601) {
      return <div>{info.Value.DateISO8601.join(', ')}</div>;
    }
    if (info.Value?.Unit) {
      return <div>{info.Value.Unit}</div>;
    }
    if (info.Value?.ExternalTableName) {
      return <div>{info.Value.ExternalTableName}</div>;
    }
    return null;
  }

  // Helper to render a section recursively
  function renderSection(section: any, level = 2, sectionNum = '') {
    if (!section) return null;
    const tagName = `h${Math.min(level, 6)}`;
    return (
      <div className="mb-6 text-black">
        <div className="border-b-4 border-blue-300 flex items-center mb-2">
          {React.createElement(
            tagName,
            { className: `font-bold text-black py-1 pl-1 mb-0 ${level === 2 ? 'text-2xl' : level === 3 ? 'text-lg' : 'text-base'}` },
            `${sectionNum} ${section.TOCHeading}`
          )}
        </div>
        {section.Description && <div className="text-black text-sm mb-2">{section.Description}</div>}
        {section.Information && section.Information.map((info: any, i: number) => (
          <div key={i} className="mb-1 text-black">{renderInfo(info)}</div>
        ))}
        {Array.isArray(section.Section) && section.Section.map((sub: any, i: number) => (
          <div key={i} className="ml-4 border-l-2 border-blue-100 pl-4 text-black">{renderSection(sub, level + 1, sectionNum ? `${sectionNum}.${i + 1}` : `${i + 1}`)}</div>
        ))}
      </div>
    );
  }

  const sections = item.Record.Section || [];


  // Dropdown state for main headings: all closed by default
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>(() => {
    const state: { [key: string]: boolean } = {};
    sections.forEach((section: any) => {
      const htmlId = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
      state[htmlId] = false;
    });
    return state;
  });
  // Track active section for highlight
  const [activeId, setActiveId] = useState<string>('summary');
  // Refs for all section ids
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Setup IntersectionObserver for section highlighting
  useEffect(() => {
    const ids = ['summary', ...sections.map((section: any) => (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase())];
    ids.forEach(id => {
      sectionRefs.current[id] = document.getElementById(id);
    });
    const observer = new window.IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the first visible section (topmost)
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  function renderTOC(sections: any[], level = 1, parentIdx = ''): React.ReactNode {
    return (
      <ul className={`text-[13px] text-black bg-white ${level > 1 ? 'ml-4 mt-1 border-l border-blue-100 pl-2' : ''}`}>
        {sections.map((section: any, idx: number) => {
          const sectionId = (parentIdx ? parentIdx + '.' : '') + (idx + 1);
          const htmlId = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
          const hasSub = Array.isArray(section.Section) && section.Section.length > 0;
          const isOpen = openDropdowns[htmlId] ?? false;
          const isActive = activeId === htmlId || activeId.startsWith(htmlId + '.');
          return (
            <React.Fragment key={htmlId + sectionId}>
              <li>
                <div
                  className={`flex items-center group rounded transition-colors ${
                    isActive && level === 1 ? 'bg-blue-100' : level === 1 ? 'bg-blue-50' : ''
                  }`}
                >
                  <button
                    className={`w-full text-left px-2 py-1 rounded hover:bg-blue-100 transition-colors ${
                      isActive ? 'font-bold text-black' : 'text-black'
                    }`}
                    style={{ background: 'none', color: 'black', outline: 'none' }}
                    onClick={() => {
                      const el = document.getElementById(htmlId);
                      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                  >
                    <span className="inline-block w-10 font-semibold text-black">{sectionId}</span>
                    <span className="text-black">{section.TOCHeading}</span>
                  </button>
                  {hasSub && level === 1 && (
                    <button
                      className="ml-1 px-1 py-1 text-xs text-blue-700 hover:bg-blue-200 rounded transition-colors flex items-center"
                      style={{ outline: 'none' }}
                      onClick={() => setOpenDropdowns((o: any) => ({ ...o, [htmlId]: !isOpen }))}
                      tabIndex={-1}
                      aria-label={isOpen ? 'Collapse section' : 'Expand section'}
                    >
                      <span className="inline-block align-middle" style={{ fontSize: '12px' }}>{isOpen ? '▼' : '▶'}</span>
                    </button>
                  )}
                </div>
                {hasSub && isOpen && (
                  <div className="bg-white">
                    {section.Section.map((sub: any, subIdx: number) => {
                      const subSectionId = sectionId + '.' + (subIdx + 1);
                      const subHtmlId = (sub.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
                      const subIsActive = activeId === subHtmlId || activeId.startsWith(subHtmlId + '.');
                      return (
                        <div key={subHtmlId + subSectionId} className="pl-2 border-l border-blue-100 bg-white">
                          <button
                            className={`w-full text-left px-2 py-1 rounded hover:bg-blue-50 transition-colors ${subIsActive ? 'font-bold text-black' : 'text-black'}`}
                            style={{ background: 'none', color: 'black', outline: 'none', fontWeight: subIsActive ? 'bold' : 'normal' }}
                            onClick={() => {
                              const el = document.getElementById(subHtmlId);
                              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }}
                          >
                            <span className="inline-block w-10 font-semibold text-black">{subSectionId}</span>
                            <span className="text-black">{sub.TOCHeading}</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </li>
              {/* Divider between main items */}
              {level === 1 && idx !== sections.length - 1 && (
                <li><hr className="border-blue-100 my-0.5" /></li>
              )}
            </React.Fragment>
          );
        })}
      </ul>
    );
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
      {/* Compound Summary Card at the top */}
      <div className="w-full max-w-7xl flex flex-row md:flex-row gap-4 text-black">
        {/* Left: CompoundSummary and Main Content together */}
        <div className="flex-1 flex flex-col gap-6 min-w-0">
          <div className="max-w-3xl">
            <CompoundSummary record={item.Record} />
          </div>
          <LeftContent
            sections={sections}
            sectionRefs={sectionRefs}
            renderSection={renderSection}
          />
        </div>
        {/* Right: TOC as separate component */}
        <div className="w-72 max-w-[18rem] min-w-[16rem] overflow-x-auto sticky top-8 self-start">
          <RightContent
            sections={sections}
            renderTOC={renderTOC}
            activeId={activeId}
          />
        </div>
      </div>
    </div>
  );
};

export default CompoundPage;


