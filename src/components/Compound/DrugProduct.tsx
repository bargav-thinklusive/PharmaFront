import React from 'react';
import UniversalDataRenderer from '../Universal/UniversalDataRenderer';
interface DrugProductProps {
  drugProduct: any;
}

const DrugProduct: React.FC<DrugProductProps> = ({ drugProduct }) => {



  return (
    <UniversalDataRenderer
      data={drugProduct}
      title="Drug Product"
      sectionId="section-4"
    />
  );
};

export default DrugProduct;