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
    const traverse = (secs: any[], parentIdx = '', level = 1) => {
      secs.forEach((sec: any, idx: number) => {
        const sectionId = (parentIdx ? parentIdx + '.' : '') + (level === 1 ? idx + 2 : idx + 1);
        const normalized = (sec.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
        const htmlId = `${sectionId}-${normalized}`;
        state[htmlId] = false;
        if (Array.isArray(sec.Section)) traverse(sec.Section, sectionId, level + 1);
      });
    };
    traverse(sections, '', 1);
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
// Render TOC
const renderTOC = (sections: any[], level = 1, parentIdx = ''): React.ReactNode => (
  <ul
    className={`list-none m-0 p-0 ${
      level > 1 ? 'ml-4 pl-3 border-l border-gray-400' : ''
    }`}
  >
    {sections.map((section: any, idx: number) => {
      const sectionId = (parentIdx ? parentIdx + '.' : '') + (level === 1 ? idx + 2 : idx + 1);
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
