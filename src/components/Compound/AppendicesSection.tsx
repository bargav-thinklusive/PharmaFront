import React from 'react';
import UniversalDataRenderer from '../Universal/UniversalDataRenderer';
interface AppendicesSectionProps {
  appendices: any;
}


const AppendicesSection: React.FC<AppendicesSectionProps> = ({ appendices }) => {
  return (
    <UniversalDataRenderer
      data={appendices}
      title="Appendices"
      sectionId="section-5"
      maxTableSize={2} // Very low threshold to force subsections for complex appendices
    />
  );
};

export default AppendicesSection;