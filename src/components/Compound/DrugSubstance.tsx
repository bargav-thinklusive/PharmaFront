import React from 'react';
import UniversalDataRenderer from '../Universal/UniversalDataRenderer';

interface DrugSubstanceProps {
  drugSubstance: any;
}


const DrugSubstance: React.FC<DrugSubstanceProps> = ({ drugSubstance }) => {
  return (
    <UniversalDataRenderer
      data={drugSubstance}
      title="Drug Substance"
      sectionId="section-3"
    />
  );
};

export default DrugSubstance;