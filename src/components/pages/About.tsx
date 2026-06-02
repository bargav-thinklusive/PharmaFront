import React from 'react';
import PageHeader from '../shared/PageHeader';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <PageHeader
        eyebrow="Who We Are"
        title="About us"
        subtitle="Equipping pharmaceutical teams with the clarity and confidence to successfully build portfolios and execute filings."
      />

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 sm:pt-2 pb-8">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="space-y-4">

            {/* Mission */}
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2">Mission</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Unify trusted, fragmented intelligence and equip pharmaceutical teams with the clarity and confidence needed to execute portfolio building, product development and global filings successfully.
              </p>
            </div>

            {/* Vision */}
            <div className="p-3 sm:p-4 bg-green-50 rounded-lg border-l-4 border-[#36b669]">
              <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-2">Vision</h3>
              <p className="text-sm sm:text-base text-gray-700">
                Our vision is to become a trusted global source of CMC and regulatory intelligence - turning complexity into clarity across global development and approvals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;