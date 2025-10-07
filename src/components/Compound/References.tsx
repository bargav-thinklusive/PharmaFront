import React from 'react';
import UniversalDataRenderer from '../Universal/UniversalDataRenderer';

interface ReferencesProps {
  references: any[];
}

const References: React.FC<ReferencesProps> = ({ references }) => {
  return (
    <UniversalDataRenderer
      data={references}
      title="References"
      sectionId="section-6"
    />
  );
};

export default References;