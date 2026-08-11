import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiSliders, FiBriefcase, FiGlobe, FiTag, FiRotateCcw } from 'react-icons/fi';
import { useUser } from '../context/UserContext';
import { trackDrugSearch } from '../utils/utils';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
  initialCompany?: string;
  initialRegion?: string;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "drugName", label: "Drug Name" },
  { value: "apiName", label: "API Name" },
  { value: "iupacName", label: "IUPAC Name" },
  { value: "innName", label: "INN Name" },
  { value: "cid", label: "CID" },
];

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
  initialCategory = "all",
  initialCompany = "",
  initialRegion = "",
}) => {
  const navigate = useNavigate();
  const { drugsData } = useUser();

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [company, setCompany] = useState(initialCompany);
  const [region, setRegion] = useState(initialRegion);

  // Extract unique companies from drugsData dynamically
  const availableCompanies = useMemo(() => {
    const set = new Set<string>();
    (drugsData || []).forEach((item: any) => {
      const comp = item?.ProductOverview?.companyName || item?.company || item?.companyName;
      if (comp && typeof comp === 'string' && comp.trim()) {
        set.add(comp.trim());
      }
    });
    return Array.from(set).sort();
  }, [drugsData]);

  // Extract unique regions from drugsData dynamically
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    (drugsData || []).forEach((item: any) => {
      const reg =
        item?.ProductOverview?.firstApprovedRegion ||
        item?.RegulatoryInsights?.regionalApproval ||
        item?.region ||
        item?.firstApprovedRegion;
      if (reg && typeof reg === 'string' && reg.trim()) {
        const cleanReg = reg.trim();
        if (cleanReg.length < 30) {
          set.add(cleanReg);
        } else {
          if (cleanReg.toLowerCase().includes('usa') || cleanReg.toLowerCase().includes('us')) set.add('USA');
          if (cleanReg.toLowerCase().includes('eu') || cleanReg.toLowerCase().includes('europe')) set.add('EU');
          if (cleanReg.toLowerCase().includes('japan')) set.add('Japan');
          if (cleanReg.toLowerCase().includes('china')) set.add('China');
          if (cleanReg.toLowerCase().includes('india')) set.add('India');
          if (cleanReg.toLowerCase().includes('germany')) set.add('Germany');
        }
      }
    });
    if (set.size === 0) {
      ['USA', 'EU', 'Germany', 'Global', 'India', 'Japan'].forEach(r => set.add(r));
    }
    return Array.from(set).sort();
  }, [drugsData]);

  if (!isOpen) return null;

  const handleReset = () => {
    setQuery("");
    setCategory("all");
    setCompany("");
    setRegion("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      trackDrugSearch(trimmedQuery);
    }

    const searchText = trimmedQuery ? encodeURIComponent(trimmedQuery) : "all";
    const params = new URLSearchParams();

    if (company) params.set("company", company);
    if (region) params.set("region", region);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const targetUrl = `/${category}/${searchText}${queryString}`;

    onClose();
    navigate(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-border-main overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-border-main flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <FiSliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-main font-display">Advanced Search</h2>
              <p className="text-xs text-body font-medium">Search with detailed parameters, company, and region filters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-body hover:text-main hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
              <FiSearch className="w-3.5 h-3.5 text-primary" /> Search Keyword
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter drug name, API, IUPAC, CID..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border-main focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium text-main outline-none transition-all placeholder:text-gray-400"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-main text-xs font-bold px-1 py-0.5 cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
              <FiTag className="w-3.5 h-3.5 text-primary" /> Search Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-left flex items-center justify-between ${
                    category === cat.value
                      ? 'bg-primary text-white border-primary shadow-xs'
                      : 'bg-slate-50 text-body border-border-main hover:bg-slate-100 hover:text-main'
                  }`}
                >
                  <span>{cat.label}</span>
                  {category === cat.value && <span className="w-1.5 h-1.5 rounded-full bg-white ml-2" />}
                </button>
              ))}
            </div>
          </div>

          {/* Company & Region Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Company Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiBriefcase className="w-3.5 h-3.5 text-primary" /> Company / Manufacturer
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Type company name..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-main focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium text-main outline-none transition-all placeholder:text-gray-400 bg-white"
                />
                {availableCompanies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] font-bold text-gray-400 w-full px-1">Quick Select:</span>
                    {availableCompanies.slice(0, 8).map((comp) => (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => setCompany(company === comp ? "" : comp)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          company.toLowerCase() === comp.toLowerCase()
                            ? 'bg-primary text-white'
                            : 'bg-white text-main hover:bg-primary-light hover:text-primary border border-slate-200'
                        }`}
                      >
                        {comp}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiGlobe className="w-3.5 h-3.5 text-primary" /> Approved Region / Country
              </label>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Type region (e.g. USA, EU...)"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border-main focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium text-main outline-none transition-all placeholder:text-gray-400 bg-white"
                />
                {availableRegions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-lg border border-slate-200/80">
                    <span className="text-[10px] font-bold text-gray-400 w-full px-1">Quick Select:</span>
                    {availableRegions.slice(0, 8).map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setRegion(region === reg ? "" : reg)}
                        className={`text-[11px] px-2 py-0.5 rounded-md font-semibold transition-colors cursor-pointer ${
                          region.toLowerCase() === reg.toLowerCase()
                            ? 'bg-primary text-white'
                            : 'bg-white text-main hover:bg-primary-light hover:text-primary border border-slate-200'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-border-main flex items-center justify-between">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-600 hover:text-main hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            Reset Filters
          </button>
          
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-slate-200/60 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <FiSearch className="w-4 h-4" />
              Apply & Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearchModal;
