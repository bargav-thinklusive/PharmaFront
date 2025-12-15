import React from 'react';

const WhatWeDo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              What we do
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px]">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  A data-driven platform that accelerates and de-risks
                </h3>
                <p className="text-gray-700">
                  A data-driven platform that accelerates and de-risks drug development
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Welcome to CMC Intel
                </h3>
                <p className="text-gray-700">
                  Welcome to CMC Intel - Your comprehensive platform for pharmaceutical intelligence.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  CMCIntel provides transformative intelligence
                </h3>
                <p className="text-gray-700">
                  CMCIntel provides transformative intelligence, empowering innovation through enriched data, advanced analytics, and expert insights across the pharmaceutical industry.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data as a Service
                </h3>
                <p className="text-gray-700">
                  CMC Intel's Data-as-a-Service (DaaS) platform empowers faster and lower-risk drug development by providing comprehensive, structured intelligence on the development, manufacturing, and regulatory history of each molecule. By integrating global data from discovery through approval, the platform enables R&D, CMC, and regulatory teams to make informed, data-driven decisions—reducing duplication of effort, identifying development bottlenecks early, and accelerating the path from lab to market.
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Data Validation and Quality Check
                </h3>
                <p className="text-gray-700">
                  All data within the CMC Intel platform undergoes rigorous validation and multi-layer quality checks to ensure accuracy, consistency, and regulatory relevance. Each data source is verified against authoritative references, and automated algorithms are complemented by expert scientific review to maintain data integrity. This robust quality framework ensures users can rely on CMC Intel's insights for confident, evidence-based decision-making across development and regulatory functions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDo;