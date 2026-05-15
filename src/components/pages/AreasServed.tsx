import React from 'react';

const AreasServed: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              Areas Served
            </h1>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#36b669]/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 pb-10">
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