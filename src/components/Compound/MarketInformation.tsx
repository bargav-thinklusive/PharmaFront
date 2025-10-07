import React from 'react';
import KeyValueTable from './KeyValueTable';

interface MarketInformationProps {
  marketInformation: any;
}

const MarketInformation: React.FC<MarketInformationProps> = ({ marketInformation }) => {
  return (
    <div className="mb-10">
      <h1 id="section-2" className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4">
        2. Market Information
      </h1>
      <KeyValueTable data={marketInformation} />
      <div>
        <h2 className="text-xl font-bold mt-6 mb-2">References</h2>
        
      </div>
    </div>
  );
};

export default MarketInformation;