import React, { useState, useMemo } from 'react';
import SearchBar from '../SearchBar';
import AddDrugModal from '../CompoundForm/AddDrugModal';
import MoleculeBackground from '../shared/MoleculeBackground';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { getAllDrafts } from '../../hooks/useDraft';
import { FiPlus, FiFileText, FiSearch, FiZap, FiArrowRight } from 'react-icons/fi';
import useRoles from '../../hooks/useRoles';

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { user, drugsData } = useUser();
  const { canEditDrugs } = useRoles();
  const navigate = useNavigate();

  const firstName = user?.data?.name?.split(' ')[0] || 'there';

  const drafts = getAllDrafts();
  const draftCount = drafts.length;

  const popularSearches = useMemo(() => {
    // 1. Load search history from local storage
    let history: Record<string, number> = {};
    try {
      history = JSON.parse(localStorage.getItem('search_history') || '{}');
    } catch (e) {
      console.error(e);
    }

    // 2. Extract unique drug names dynamically from the API drugs list
    const apiDrugNames: string[] = [];
    const seenApiNames = new Set<string>();
    
    (drugsData || []).forEach((item: any) => {
      const name = item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.drugName;
      if (name && typeof name === 'string' && name.trim()) {
        const cleanName = name.trim();
        const lowerName = cleanName.toLowerCase();
        if (!seenApiNames.has(lowerName)) {
          seenApiNames.add(lowerName);
          apiDrugNames.push(cleanName);
        }
      }
    });

    // 3. Score each unique drug name based on user's search history
    const getSearchScore = (drugName: string) => {
      const lowerDrugName = drugName.toLowerCase();
      let score = 0;
      Object.entries(history).forEach(([term, count]) => {
        const lowerTerm = term.toLowerCase();
        if (
          lowerDrugName === lowerTerm ||
          lowerDrugName.includes(lowerTerm) ||
          lowerTerm.includes(lowerDrugName)
        ) {
          score += count;
        }
      });
      return score;
    };

    // 4. Sort the unique drug names based on their search score (descending)
    const sortedDrugs = [...apiDrugNames].sort((a, b) => {
      const scoreA = getSearchScore(a);
      const scoreB = getSearchScore(b);
      return scoreB - scoreA;
    });

    // 5. Return top 7 unique searches/drugs directly from drugsData
    return sortedDrugs.slice(0, 7);
  }, [drugsData]);

  const quickActions = [
    {
      icon: <FiSearch className="w-6 h-6" />,
      title: 'Search Drugs',
      desc: 'Find chemical and regulatory information from authoritative sources.',
      color: 'from-primary/10 to-primary/5',
      iconBg: 'bg-primary',
      action: () => document.getElementById('home-searchbar')?.querySelector('input')?.focus(),
      cta: 'Start Searching',
      badge: null,
    },
    ...(canEditDrugs ? [
      {
        icon: <FiPlus className="w-6 h-6" />,
        title: 'Add New Drug',
        desc: 'Submit a new drug entry with full CMC and regulatory details.',
        color: 'from-navy/10 to-navy/5',
        iconBg: 'bg-navy',
        action: () => setShowModal(true),
        cta: 'Add Drug',
        badge: null,
      },
      {
        icon: <FiFileText className="w-6 h-6" />,
        title: `My Drafts (${draftCount})`,
        desc: 'Continue working on your saved drug drafts anytime.',
        color: 'from-amber-50 to-amber-50/30',
        iconBg: 'bg-amber-500',
        action: () => navigate('/drug-form'),
        cta: draftCount > 0 ? `View ${draftCount} Draft${draftCount > 1 ? 's' : ''}` : 'Start a Draft',
        badge: draftCount > 0 ? draftCount : null,
      }
    ] : [])
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-page font-sans overflow-x-hidden relative">
      {/* Soft background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-primary-light to-transparent blur-3xl" />
        <div className="absolute bottom-[5%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-primary-light to-transparent blur-3xl" />
      </div>
      <MoleculeBackground variant="dna" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-14 pb-20">

        {/* ── Hero ── */}
        <div className="flex flex-col items-center text-center mb-12">
          {/* Greeting badge */}
          <div className="inline-flex items-center gap-2 text-primary font-bold text-sm tracking-wider uppercase mb-5 bg-primary-light px-4 py-1.5 rounded-full border border-primary/20">
            <FiZap className="w-3.5 h-3.5" />
            Welcome back, {firstName}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-main font-display mb-5 leading-tight sm:whitespace-nowrap">
            Explore <span className="text-primary">Pharmaceutical</span> Intelligence
          </h1>

          <p className="text-lg text-body leading-relaxed max-w-2xl mx-auto mb-10">
            Search, manage, and analyse drug compounds with trusted CMC and regulatory data — all in one place.
          </p>

          {/* Search bar */}
          <div id="home-searchbar" className="w-full max-w-2xl mb-6">
            <SearchBar compact={true} />
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
            <span className="text-xs font-semibold text-body mr-1">Popular:</span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => navigate(`/all/${encodeURIComponent(term)}`)}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-primary-light border border-border-main hover:border-primary/40 text-xs font-semibold text-main hover:text-primary transition-all duration-200 cursor-pointer shadow-xs"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="flex items-center justify-center mb-12">
          <div className="h-px bg-border-main flex-1 max-w-[100px]" />
          <div className="w-2 h-2 rounded-full bg-primary mx-3" />
          <p className="text-xs font-semibold uppercase tracking-widest text-body">Quick Actions</p>
          <div className="w-2 h-2 rounded-full bg-primary mx-3" />
          <div className="h-px bg-border-main flex-1 max-w-[100px]" />
        </div>

        {/* ── Quick Action Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {quickActions.map(({ icon, title, desc, color, iconBg, action, cta, badge }) => (
            <div
              key={title}
              onClick={action}
              className={`group bg-gradient-to-br ${color} bg-white rounded-2xl border border-border-main p-7 flex flex-col gap-4 cursor-pointer hover:shadow-xl hover:border-primary/30 hover:scale-[1.02] transition-all duration-300 relative`}
            >
              {/* Badge */}
              {badge !== null && badge !== undefined && (
                <span className="absolute top-4 right-4 min-w-[24px] h-6 px-1.5 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                  {badge}
                </span>
              )}
              <div className={`w-12 h-12 rounded-xl ${iconBg} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-main font-display mb-1">{title}</h3>
                <p className="text-sm text-body leading-relaxed">{desc}</p>
              </div>
              <div className="flex items-center gap-1 text-primary text-sm font-semibold mt-auto pt-1 group-hover:gap-2 transition-all duration-200">
                {cta}
                <FiArrowRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      {showModal && <AddDrugModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;
