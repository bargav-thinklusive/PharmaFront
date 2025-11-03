import React from 'react';
import { useParams } from 'react-router-dom';
import Summary from '../Summary';
import Table from '../Table';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';
import { useUser } from '../../../context/UserContext';
import DynamicMarketInformation from '../sections/MarketInformation/DynamicMarketInformation';
import DynamicDrugSubstance from '../sections/DrugSubstance/DynamicDrugSubstance';
import DynamicDrugProduct from '../sections/DrugProduct/DynamicDrugProduct';
import DynamicAppendices from '../sections/Appendices/DynamicAppendices';
import DynamicReferences from '../sections/References/DynamicReferences';

/**
 * Universal Compound Renderer
 *
 * Follows CompoundInformation structure but works dynamically with any JSON.
 * Uses existing components: KeyValueTable, AppendixLink, ManufacturingSites, etc.
 */






// Main Component
const UniversalCompoundRenderer: React.FC = () => {
  const { cid, version } = useParams();
  const { activeSection, handleNavigate } = useIntersectionObserver();
  const { drugsData } = useUser();

  const drug = drugsData.find((d: any) => d.cid === cid && d.version === parseInt(version || '1'));

  if (!drug) {
    return (
      <div className="p-8 text-center text-red-600 text-xl">
        No data found for this drug with CID {cid}.
      </div>
    );
  }

  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center bg-white/80 py-8 text-black">
      <div className='w-full max-w-7xl flex flex-row gap-4'>
        <div className='flex-1 flex flex-col gap-6 min-w-0 mr-80'>
          {/* Title and Summary - Section 1 */}
          <div className='mb-10' id="section-1">
            <Summary drug={drug} sectionId={1} />
          </div>

          {/* Section 2: Market Information */}
          {drug.marketInformation && <DynamicMarketInformation marketInformation={drug.marketInformation} />}

          {/* Section 3: Drug Substance */}
          {drug.drugSubstance && <DynamicDrugSubstance drugSubstance={drug.drugSubstance} drug={drug} />}

          {/* Section 4: Drug Product */}
          {drug.drugProduct && <DynamicDrugProduct drugProduct={drug.drugProduct} />}

          {/* Section 5: Appendices */}
          {drug.appendices && <DynamicAppendices appendices={drug.appendices} />}

          {/* Section 6: References */}
          {drug.references && <DynamicReferences references={drug.references} />}
        </div>

        {/* Fixed TOC */}
        <div className="fixed right-0 top-20 w-80 h-[calc(100vh-12rem)] overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 shadow-lg" style={{ zIndex: 50 }}>
          <Table
            drug={drug}
            activeSection={activeSection}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>
  );
};

export default UniversalCompoundRenderer;
