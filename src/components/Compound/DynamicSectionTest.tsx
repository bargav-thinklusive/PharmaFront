import React from 'react';
import DynamicSection from './DynamicSection';
import { drugData } from '../../sampleData/data';

const DynamicSectionTest: React.FC = () => {
  const drug = drugData[0]; // Use the first drug for testing

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Dynamic Section Component Test</h1>

      {/* Test References */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">References Section</h2>
        <DynamicSection
          data={drug.references}
          sectionType="references"
          title="6. References"
        />
      </div>

      {/* Test Appendices */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Appendices Section</h2>
        <DynamicSection
          data={drug.appendices}
          sectionType="appendices"
          title="5.Appendices"
        />
      </div>

      {/* Test Market Information */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Market Information Section</h2>
        <DynamicSection
          data={drug.marketInformation}
          sectionType="marketInformation"
          title="2. Market Information"
        />
      </div>

      {/* Test Drug Substance */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Drug Substance Section</h2>
        <DynamicSection
          data={drug.drugSubstance}
          sectionType="drugSubstance"
          title="3. Drug Substance"
        />
      </div>

      {/* Test Drug Product */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Drug Product Section</h2>
        <DynamicSection
          data={drug.drugProduct}
          sectionType="drugProduct"
          title="4. Drug Product"
        />
      </div>
    </div>
  );
};

export default DynamicSectionTest;