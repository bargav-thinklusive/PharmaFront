import React from 'react';
import UniversalDataRenderer from '../Universal/UniversalDataRenderer';

interface MarketInformationProps {
  marketInformation: any;
}

const MarketInformation: React.FC<MarketInformationProps> = ({ marketInformation }) => {
  return (
    <div className="mb-10">
      <h1 id="section-2" className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4">
        2. Market Information
      </h1>
      <UniversalDataRenderer
        data={marketInformation}
      />
    </div>
  );
};

export default MarketInformation;