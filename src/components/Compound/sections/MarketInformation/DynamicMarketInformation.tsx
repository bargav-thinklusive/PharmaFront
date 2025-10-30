import React from 'react';
import KeyValueTable from '../../KeyValueTable';

interface DynamicMarketInformationProps {
  marketInformation: any;
}

const DynamicMarketInformation: React.FC<DynamicMarketInformationProps> = ({ marketInformation }) => {
  if (!marketInformation) return null;

  const { specialStatus, ...otherData } = marketInformation;

  // If specialStatus is short (less than 200 characters), include it in the table
  const includeSpecialStatusInTable = specialStatus && specialStatus.length < 200;

  const tableData = includeSpecialStatusInTable
    ? { ...otherData, specialStatus }
    : otherData;

  return (
    <div className="mb-10">
      <h1 id="section-2" className="text-2xl font-bold border-sky-400 border-b-4 pb-1 mb-4">
        2. Market Information
      </h1>
      <KeyValueTable data={tableData} />
      {specialStatus && !includeSpecialStatusInTable && (
        <div className="mt-6">
          <h2 className="text-lg font-bold border-blue-400 border-b-3 pb-1 mb-4">Special Status</h2>
          <ul className="list-disc list-inside">
            {specialStatus.split('. ').map((point: string, idx: number) => (
              <li key={idx} className="mb-1">{point.trim()}{point.trim() && !point.trim().endsWith('.') ? '.' : ''}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DynamicMarketInformation;