import React from 'react';
import PageHeader from '../shared/PageHeader';

const AreasServed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <PageHeader
        eyebrow="Our Expertise"
        title="Areas Served"
        subtitle="Comprehensive analytical, manufacturing, and regulatory support across all clinical phases and substance categories."
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {[
              'API/Drug Substance',
              'Drug Product',
              'Regulatory History',
              'Consulting Services',
              'Nitrosamines',
              'Extractables and Leachables',
              'Dissolution',
              'Residual Solvents',
              'Analytical and Manufacturing CMC',
              'Strategy and planning for CMC',
            ].map((area, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
              >
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{area}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreasServed;