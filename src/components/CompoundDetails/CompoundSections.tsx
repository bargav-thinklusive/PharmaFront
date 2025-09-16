import React from 'react';

interface CompoundSectionsProps {
  sections: any[];
  renderSection: (section: any, level?: number, sectionNum?: string) => React.ReactNode;
}

const CompoundSections: React.FC<CompoundSectionsProps> = ({ sections, renderSection }) => {
  return (
    <div>
      {sections.map((s: any, i: number) => (
        <div key={i}>{renderSection(s, 2, `${i + 1}`)}</div>
      ))}
    </div>
  );
};

export default CompoundSections;
