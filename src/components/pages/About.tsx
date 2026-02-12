import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-2">
              About us
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-white rounded-lg shadow-lg p-8 min-h-[500px]">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Mission
                </h3>
                <p className="text-gray-700">
                  Unify trusted, fragmented intelligence and equip pharmaceutical teams with the clarity and confidence needed to execute portfolio building, product development and global filings successfully.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Vision
                </h3>
                <p className="text-gray-700">
                  Our vision is to become a trusted global source of CMC and regulatory intelligence - turning complexity into clarity across global development and approvals.
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Newsletter
                </h3>
                <p className="text-gray-700 mb-4">
                  Stay updated with the latest news and insights from CMC Intel.
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36b669]"
                  />
                  <button className="bg-[#36b669] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#2d9d58] transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;