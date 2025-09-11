import React from 'react';

interface LeftContentProps {
  sections: any[];
  sectionRefs: React.MutableRefObject<{ [key: string]: HTMLElement | null }>;
  renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
}

const LeftContent: React.FC<LeftContentProps> = ({ sections, sectionRefs, renderSection }) => {
  return (
  <div className="flex-1 bg-white p-0 md:p-4 overflow-x-auto max-w-full text-black">
      {sections.map((section: any, idx: number) => {
        const htmlId = (section.TOCHeading || '').replace(/\s+/g, '').toLowerCase();
        return (
          <div
            key={section.TOCHeading}
            id={htmlId}
            ref={el => { if (el) sectionRefs.current[htmlId] = el; }}
            className="mt-8 scroll-mt-24"
          >
            {/* Section content (including heading and subheadings) */}
            {renderSection(section, 2, `${idx + 1}`)}
          </div>
        );
      })}
    </div>
  );
};

export default LeftContent;




