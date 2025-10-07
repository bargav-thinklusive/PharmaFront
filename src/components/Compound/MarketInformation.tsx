import React from 'react';
import KeyValueTable from './KeyValueTable';

interface MarketInformationProps {
  marketInformation: any;
}

// Reference data for Market Information section
const marketInfoReference = {
  key: "REF-2.1",
  link: "https://example.com/market-information-data"
};

const MarketInformation: React.FC<MarketInformationProps> = ({ marketInformation }) => {
  return (
    <div className="mb-10">
      <h1 id="section-2" className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4">
        2. Market Information
      </h1>
      <KeyValueTable data={marketInformation} />
      
      {/* Reference after table */}
      <div className="mt-4 p-2 bg-gray-50 border-l-4 border-sky-400">
        <p className="text-sm text-gray-600">
          <strong>Reference:</strong> {marketInfoReference.key} - 
          <a 
            href={marketInfoReference.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 underline hover:text-blue-800 ml-1"
          >
            {marketInfoReference.link}
          </a>
        </p>
      </div>
    </div>
  );
};

export default MarketInformation;