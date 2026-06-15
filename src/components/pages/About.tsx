import React from 'react';
import { FiTarget, FiEye, FiBarChart2, FiShield, FiUsers, FiActivity } from 'react-icons/fi';
import MoleculeBackground from '../shared/MoleculeBackground';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-page pt-20 pb-20 font-sans overflow-x-hidden relative">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none -z-10">
          <div className="absolute top-[5%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
          <div className="absolute top-[10%] -right-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-l from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
      </div>
      <MoleculeBackground variant="dna" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-6 bg-primary-light px-3 py-1 rounded-full border border-primary-light">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Who We Are
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-main font-display mb-6">
              About <span className="text-primary">us</span>
          </h1>
          
          <p className="text-lg text-body leading-relaxed max-w-2xl mx-auto mb-8">
              Equipping pharmaceutical teams with the clarity and confidence to successfully build portfolios and execute filings.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center w-full max-w-[150px] mx-auto">
              <div className="h-px bg-border-main flex-grow"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary mx-4"></div>
              <div className="h-px bg-border-main flex-grow"></div>
          </div>
        </div>

        {/* Mission and Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            {/* Mission */}
            <div className="group bg-white rounded-3xl shadow-sm border border-border-main p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 hover:shadow-xl hover:border-primary-hover hover:scale-[1.03] transition-all duration-300 cursor-default">
                <div className="w-20 h-20 rounded-full bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white flex-shrink-0 border-4 border-white shadow-sm transition-all duration-300">
                    <FiTarget className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-section font-display mb-3">Mission</h3>
                    <p className="text-body leading-relaxed">
                        Unify trusted, fragmented intelligence and equip pharmaceutical teams with the clarity and confidence needed to execute portfolio building, product development and global filings successfully.
                    </p>
                </div>
            </div>

            {/* Vision */}
            <div className="group bg-white rounded-3xl shadow-sm border border-border-main p-8 sm:p-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 hover:shadow-xl hover:border-primary-hover hover:scale-[1.03] transition-all duration-300 cursor-default">
                <div className="w-20 h-20 rounded-full bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white flex-shrink-0 border-4 border-white shadow-sm transition-all duration-300">
                    <FiEye className="w-10 h-10" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-section font-display mb-3">Vision</h3>
                    <p className="text-body leading-relaxed">
                        Our vision is to become a trusted global source of CMC and regulatory intelligence - turning complexity into clarity across global development and approvals.
                    </p>
                </div>
            </div>
        </div>

        {/* What drives us section */}
        <div className="bg-white rounded-3xl shadow-sm border border-border-main p-10 lg:p-14 mb-8 text-center max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-section font-display mb-4">What drives us</h3>
            {/* Small green divider */}
            <div className="w-12 h-1 bg-primary rounded-full mx-auto mb-12"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 lg:divide-x divide-border-main">
                {/* Column 1 */}
                <div className="group flex flex-col items-center lg:px-4 hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-16 h-16 rounded-full bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-300">
                        <FiBarChart2 className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-section font-display mb-3">Data-Driven</h4>
                    <p className="text-body text-sm leading-relaxed">
                        Turning complex, disparate data into clear, actionable intelligence.
                    </p>
                </div>
                {/* Column 2 */}
                <div className="group flex flex-col items-center lg:px-4 hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-16 h-16 rounded-full bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-300">
                        <FiShield className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-section font-display mb-3">De-risk Development</h4>
                    <p className="text-body text-sm leading-relaxed">
                        Reducing uncertainty at every stage of the drug development journey.
                    </p>
                </div>
                {/* Column 3 */}
                <div className="group flex flex-col items-center lg:px-4 hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-16 h-16 rounded-full bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-300">
                        <FiUsers className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-section font-display mb-3">Trusted Partnership</h4>
                    <p className="text-body text-sm leading-relaxed">
                        Collaborating closely with our clients to achieve sustainable outcomes.
                    </p>
                </div>
                {/* Column 4 */}
                <div className="group flex flex-col items-center lg:px-4 hover:scale-105 transition-transform duration-300 cursor-default">
                    <div className="w-16 h-16 rounded-full bg-primary-light group-hover:bg-primary flex items-center justify-center text-primary group-hover:text-white mb-6 transition-all duration-300">
                        <FiActivity className="w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-section font-display mb-3">Scientific Excellence</h4>
                    <p className="text-body text-sm leading-relaxed">
                        Combining domain expertise with advanced analytics and technology.
                    </p>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default About;