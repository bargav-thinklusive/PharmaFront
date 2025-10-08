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
      <div className='flex justify-start items-center'>
        <p className="font-bold mt-6 mb-2">References:</p>
        <a href='https://google.com' target="_blank"
          rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800 block break-words pt-3">google.com</a>
        
      </div>
    </div>
  );
};

export default MarketInformation;