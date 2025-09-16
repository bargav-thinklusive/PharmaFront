import React from 'react';

interface LeftContentProps {
  sections: any[];
  renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
}

const LeftContent: React.FC<LeftContentProps> = ({ sections, renderSection }) => {
  return (
  <div className="flex-1 bg-white p-0 md:p-4 overflow-x-auto max-w-full text-black">
      {sections.map((section: any, idx: number) => (
        <div key={section.TOCHeading} className="mt-8">
          {renderSection(section, 2, `${idx + 1}`)}
        </div>
      ))}
    </div>
  );
};

export default LeftContent;


