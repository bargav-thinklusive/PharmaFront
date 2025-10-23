import React from 'react';
import { useParams } from 'react-router-dom';
import { drugData } from '../../sampleData/data';
import Summary from './Summary';
import Table from './Table';
import MarketInformation from './MarketInformation';
import DrugSubstance from './DrugSubstance';
import DrugProduct from './DrugProduct';
import AppendicesSection from './AppendicesSection';
import References from './References';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

const CompoundInformation: React.FC = () => {
    const { cid } = useParams();
    const { activeSection, handleNavigate } = useIntersectionObserver();

    const drug = drugData.find(d => d.cid === cid);

    if (!drug) {
        return (
            <div className="p-8 text-center text-red-600 text-xl">
                No data found for this drug with CID {cid}.
            </div>
        );
    }

    return (
        <div className="w-full min-h-[60vh] bg-white/80 py-2 pl-6 pr-2 text-black">
            <div className='w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-2'>
                <div className='flex-1 flex flex-col gap-4 min-w-0 md:mr-80'>
                    {/* Title and Summary - Section 1 */}
                    <div className='mb-10' id="section-1">
                        <Summary drug={drug} sectionId={1} />
                    </div>

                    <MarketInformation marketInformation={drug.marketInformation} />
                    <DrugSubstance drugSubstance={drug.drugSubstance} />
                    <DrugProduct drugProduct={drug.drugProduct} />
                    <AppendicesSection appendices={drug.appendices} />
                    <References references={drug.references} />
                </div>

                {/* Fixed TOC - Hidden on mobile, shown on large screens */}
                <div className="hidden md:block fixed right-4 top-20 w-72 h-[calc(100vh-12rem)] overflow-y-auto bg-white border border-gray-300 rounded-lg p-4 shadow-lg" style={{ zIndex: 50 }}>
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

export default CompoundInformation;