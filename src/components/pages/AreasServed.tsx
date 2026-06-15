import React from 'react';
import { FiChevronRight, FiActivity, FiPackage, FiClock, FiUsers, FiAlertCircle, FiFilter, FiDroplet, FiThermometer, FiSettings, FiMap, FiArrowRight, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router';
import MoleculeBackground from '../shared/MoleculeBackground';

const AreasServed: React.FC = () => {
  const navigate = useNavigate();

  const areas = [
    {
      title: 'API/Drug Substance',
      description: 'Expertise in API development, characterization, and process optimization.',
      icon: FiActivity,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50'
    },
    {
      title: 'Drug Product',
      description: 'Comprehensive formulation development, scale-up, and manufacturing support.',
      icon: FiPackage,
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50'
    },
    {
      title: 'Regulatory History',
      description: 'Detailed regulatory insights and historical precedents for informed decision-making.',
      icon: FiClock,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50'
    },
    {
      title: 'Consulting Services',
      description: 'Expert guidance for your specific CMC challenges and strategic planning needs.',
      icon: FiUsers,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50'
    },
    {
      title: 'Nitrosamines',
      description: 'Risk assessment, method development, and mitigation strategies for nitrosamines.',
      icon: FiAlertCircle,
      iconColor: 'text-rose-600',
      iconBg: 'bg-rose-50'
    },
    {
      title: 'Extractables and Leachables',
      description: 'Comprehensive E&L studies to ensure container closure and packaging safety.',
      icon: FiFilter,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50'
    },
    {
      title: 'Dissolution',
      description: 'Method development, validation, and discriminatory testing for solid dosage forms.',
      icon: FiDroplet,
      iconColor: 'text-cyan-600',
      iconBg: 'bg-cyan-50'
    },
    {
      title: 'Residual Solvents',
      description: 'Identification and quantification of residual solvents according to ICH Q3C guidelines.',
      icon: FiThermometer,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50'
    },
    {
      title: 'Analytical and Manufacturing CMC',
      description: 'End-to-end analytical testing and manufacturing support across clinical phases.',
      icon: FiSettings,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50'
    },
    {
      title: 'Strategy and planning for CMC',
      description: 'Lifecycle management and regulatory strategy for successful global submissions.',
      icon: FiMap,
      iconColor: 'text-pink-600',
      iconBg: 'bg-pink-50'
    }
  ];

  return (
    <div className="min-h-screen bg-page pt-20 pb-12 font-sans overflow-x-hidden relative">
      {/* Background decoration elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none -z-10">
          <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
          <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-gradient-to-l from-primary-light to-transparent blur-3xl mix-blend-multiply"></div>
      </div>
      <MoleculeBackground />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-0 pb-12">
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-6 bg-primary-light px-3 py-1 rounded-full border border-primary-light">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              Our Expertise
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold text-main font-display mb-6">
              Areas <span className="text-primary">Served</span>
          </h1>
          
          <p className="text-lg text-body leading-relaxed max-w-2xl mx-auto mb-8">
              Comprehensive analytical, manufacturing, and regulatory support across all clinical phases and substance categories.
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center w-full max-w-[200px] mx-auto">
              <div className="h-px bg-border-main flex-grow"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary mx-4"></div>
              <div className="h-px bg-border-main flex-grow"></div>
          </div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area, index) => {
            const IconComponent = area.icon;
            // Generate a URL-friendly slug from the title (e.g., "API/Drug Substance" -> "api-drug-substance")
            const slug = '/' + area.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

            return (
              <div 
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-border-main p-6 flex flex-col justify-center hover:shadow-md hover:border-primary-hover transition-all group cursor-pointer"
                onClick={() => navigate(slug)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-full ${area.iconBg} flex items-center justify-center ${area.iconColor} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-bold text-section font-display mb-1 group-hover:text-primary transition-colors">{area.title}</h3>
                    <p className="text-body text-sm leading-snug line-clamp-2">{area.description}</p>
                  </div>
                  <div className="text-gray-300 group-hover:text-primary transition-colors flex-shrink-0">
                    <FiChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="bg-white rounded-3xl shadow-sm border border-border-main p-8 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 group">
            {/* Left green accent border */}
            <div className="absolute left-0 top-6 bottom-6 w-1.5 bg-primary-light rounded-r-lg group-hover:bg-primary transition-colors duration-500"></div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 lg:gap-8 relative z-10 pl-2">
                <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center text-navy flex-shrink-0 border-[3px] border-primary">
                    <FiSearch className="w-8 h-8" />
                </div>
                <div className="text-center md:text-left mt-2 md:mt-0">
                    <h3 className="text-2xl font-bold text-navy font-display mb-3">Your Partner in Every Phase</h3>
                    <p className="text-body max-w-3xl text-lg">
                        From early discovery to commercial success, we deliver data-driven solutions that accelerate timelines, ensure compliance, and improve patient outcomes.
                    </p>
                </div>
            </div>

            <div className="relative z-10 flex-shrink-0 w-full md:w-auto mt-4 lg:mt-0">
                <button 
                  className="w-full md:w-auto bg-navy hover:bg-slate text-white px-8 py-4 rounded-xl font-bold font-display transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  onClick={() => navigate('/contacts')}
                >
                    Let's Work Together <FiArrowRight className="w-5 h-5" />
                </button>
            </div>

            {/* Subtle background waves */}
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none -z-10">
              <svg width="400" height="200" viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 200C50 150 100 150 150 200C200 250 250 250 300 200C350 150 400 150 400 200V200H0V200Z" fill="currentColor" className="text-navy" />
                <path d="M0 150C60 100 120 100 180 150C240 200 300 200 360 150C420 100 480 100 540 150V250H0V150Z" fill="currentColor" className="text-navy" fillOpacity="0.5"/>
              </svg>
            </div>
        </div>
      </div>

    </div>
  );
};

export default AreasServed;