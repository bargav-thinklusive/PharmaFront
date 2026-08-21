import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiSliders, FiBriefcase, FiGlobe, FiTag, FiRotateCcw, FiActivity, FiLayers, FiPackage, FiChevronDown } from 'react-icons/fi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchMasterData } from '../store/slices/masterDataSlice';
import { therapeuticAreasData } from '../data/therapeuticAreasData';
import { trackDrugSearch } from '../utils/utils';

interface AdvancedSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  initialCategory?: string;
  initialCompany?: string;
  initialRegion?: string;
  initialTherapeuticArea?: string;
  initialBcsClass?: string;
  initialDosageForm?: string;
}

const CATEGORIES = [
  { value: "all", label: "All Categories" },
  { value: "drugName", label: "Drug Name" },
  { value: "apiName", label: "API Name" },
  { value: "iupacName", label: "IUPAC Name" },
  { value: "innName", label: "INN Name" },
  { value: "cid", label: "CID" },
];

const BCS_CLASSES = ["Class I", "Class II", "Class III", "Class IV"];

interface SearchableFilterInputProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
}

const SearchableFilterInput: React.FC<SearchableFilterInputProps> = ({
  value,
  onChange,
  options,
  placeholder,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  useLayoutEffect(() => {
    if (isOpen) updateCoords();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = (e: Event) => {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
      updateCoords();
    };

    const handleClickOutside = (e: MouseEvent) => {
      const isClickInContainer = containerRef.current && containerRef.current.contains(e.target as Node);
      const isClickInDropdown = dropdownRef.current && dropdownRef.current.contains(e.target as Node);
      if (!isClickInContainer && !isClickInDropdown) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter options based on input value. If empty, show ALL options.
  const filteredOptions = useMemo(() => {
    if (!value.trim()) return options;
    const q = value.trim().toLowerCase();
    return options.filter((opt) => opt.toLowerCase().includes(q));
  }, [options, value]);

  const openDropdown = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(true);
  };

  const handleSelectOption = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-primary pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            openDropdown();
          }}
          onFocus={openDropdown}
          className={`w-full ${icon ? 'pl-10' : 'pl-3.5'} pr-10 py-2.5 rounded-xl border border-border-main focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm font-medium text-main outline-none transition-all placeholder:text-gray-400 bg-white`}
        />
        <div className="absolute right-3 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-gray-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
              title="Clear"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              } else {
                openDropdown();
              }
            }}
            className="text-gray-400 hover:text-primary transition-colors p-0.5 cursor-pointer"
          >
            <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
          </button>
        </div>
      </div>

      {/* Options Dropdown Menu Portal */}
      {isOpen && coords.width > 0 && ReactDOM.createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: coords.width,
          }}
          className="bg-white border border-border-main rounded-xl shadow-2xl z-[999999] max-h-60 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {filteredOptions.length === 0 ? (
            <div className="px-3.5 py-2 text-xs text-gray-400 text-center font-medium">
              No matching options found
            </div>
          ) : (
            filteredOptions.map((opt, idx) => {
              const isSelected = opt.toLowerCase() === value.trim().toLowerCase();
              return (
                <div
                  key={`${opt}-${idx}`}
                  onClick={() => handleSelectOption(opt)}
                  className={`px-3.5 py-2 cursor-pointer text-xs font-semibold transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-primary-light/40 text-primary"
                      : "text-main hover:bg-slate-50"
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </div>
              );
            })
          )}
        </div>,
        document.body
      )}
    </div>
  );
};

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = "",
  initialCategory = "all",
  initialCompany = "",
  initialRegion = "",
  initialTherapeuticArea = "",
  initialBcsClass = "",
  initialDosageForm = "",
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const drugsData = useAppSelector((state) => state.drugs.drugsData);
  const masterData = useAppSelector((state) => state.masterData);

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [company, setCompany] = useState(initialCompany);
  const [region, setRegion] = useState(initialRegion);
  const [therapeuticArea, setTherapeuticArea] = useState(initialTherapeuticArea);
  const [bcsClass, setBcsClass] = useState(initialBcsClass);
  const [dosageForm, setDosageForm] = useState(initialDosageForm);

  // Proactively fetch master data when modal opens
  useEffect(() => {
    if (isOpen) {
      dispatch(fetchMasterData());
    }
  }, [isOpen, dispatch]);

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

  // Extract unique regions & countries dynamically from masterData API and drugsData
  const availableRegions = useMemo(() => {
    const set = new Set<string>();

    // 1. From masterData.regionsCountries API response
    if (masterData?.regionsCountries && Object.keys(masterData.regionsCountries).length > 0) {
      Object.entries(masterData.regionsCountries).forEach(([regName, countries]) => {
        if (regName && regName.trim()) set.add(regName.trim());
        if (Array.isArray(countries)) {
          countries.forEach((country) => {
            if (country && typeof country === 'string' && country.trim()) {
              set.add(country.trim());
            }
          });
        }
      });
    }

    // 2. From masterData.regulatoryAuthorities API response
    if (Array.isArray(masterData?.regulatoryAuthorities)) {
      masterData.regulatoryAuthorities.forEach((item: any) => {
        if (item?.country && typeof item.country === 'string' && item.country.trim()) {
          set.add(item.country.trim());
        }
      });
    }

    // 3. From drugsData records
    (drugsData || []).forEach((item: any) => {
      const reg =
        item?.ProductOverview?.firstApprovedRegion ||
        item?.RegulatoryInsights?.regionalApproval ||
        item?.region ||
        item?.firstApprovedRegion;
      if (reg && typeof reg === 'string' && reg.trim()) {
        const cleanReg = reg.trim();
        if (cleanReg.length < 35) {
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
      ['USA', 'EU', 'North America', 'Europe', 'Asia-Pacific', 'Germany', 'Global', 'India', 'Japan', 'United Kingdom'].forEach(r => set.add(r));
    }
    return Array.from(set).sort();
  }, [drugsData, masterData]);

  // Extract unique therapeutic areas dynamically from masterData API, fallback data, and drugsData
  const availableTherapeuticAreas = useMemo(() => {
    const set = new Set<string>();

    // 1. From masterData.therapeuticAreas API response
    if (masterData?.therapeuticAreas && Object.keys(masterData.therapeuticAreas).length > 0) {
      Object.entries(masterData.therapeuticAreas).forEach(([area, indications]) => {
        if (area && area.trim()) set.add(area.trim());
        if (Array.isArray(indications)) {
          indications.forEach((ind) => {
            if (ind && typeof ind === 'string' && ind.trim()) {
              set.add(ind.trim());
            }
          });
        }
      });
    }

    // 2. From local therapeuticAreasData fallback
    if (therapeuticAreasData) {
      Object.entries(therapeuticAreasData).forEach(([area, indications]) => {
        if (area && area.trim()) set.add(area.trim());
        if (Array.isArray(indications)) {
          indications.forEach((ind) => {
            if (ind && typeof ind === 'string' && ind.trim()) {
              set.add(ind.trim());
            }
          });
        }
      });
    }

    // 3. From drugsData records
    (drugsData || []).forEach((item: any) => {
      const ta = item?.ProductOverview?.therapeuticArea || item?.therapeuticArea;
      if (ta && typeof ta === 'string' && ta.trim()) {
        set.add(ta.trim());
      }
    });

    return Array.from(set).sort();
  }, [drugsData, masterData]);

  // Extract unique dosage forms from drugsData dynamically
  const availableDosageForms = useMemo(() => {
    const set = new Set<string>();
    (drugsData || []).forEach((item: any) => {
      const df = item?.ProductOverview?.dosageForms || item?.dosageForms;
      if (df && typeof df === 'string' && df.trim()) {
        df.split(',').forEach((s: string) => {
          if (s && s.trim()) set.add(s.trim());
        });
      }
    });
    return Array.from(set).sort();
  }, [drugsData]);

  if (!isOpen) return null;

  const handleReset = () => {
    setQuery("");
    setCategory("all");
    setCompany("");
    setRegion("");
    setTherapeuticArea("");
    setBcsClass("");
    setDosageForm("");
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
    if (therapeuticArea) params.set("therapeuticArea", therapeuticArea);
    if (bcsClass) params.set("bcsClass", bcsClass);
    if (dosageForm) params.set("dosageForm", dosageForm);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const targetUrl = `/${category}/${searchText}${queryString}`;

    onClose();
    navigate(targetUrl);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-border-main overflow-hidden flex flex-col max-h-[90vh]"
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
              <p className="text-xs text-body font-medium">Search & filter drugs by keyword, manufacturer, region, therapeutic area, and properties</p>
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
            {/* Company Filter Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiBriefcase className="w-3.5 h-3.5 text-primary" /> Company / Manufacturer
              </label>
              <SearchableFilterInput
                value={company}
                onChange={setCompany}
                options={availableCompanies}
                placeholder="Select or search company..."
              />
            </div>

            {/* Region Filter Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiGlobe className="w-3.5 h-3.5 text-primary" /> Approved Region / Country
              </label>
              <SearchableFilterInput
                value={region}
                onChange={setRegion}
                options={availableRegions}
                placeholder="Select or search region..."
              />
            </div>
          </div>

          {/* Therapeutic Area & BCS Class & Dosage Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            {/* Therapeutic Area Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiActivity className="w-3.5 h-3.5 text-primary" /> Therapeutic Area
              </label>
              <SearchableFilterInput
                value={therapeuticArea}
                onChange={setTherapeuticArea}
                options={availableTherapeuticAreas}
                placeholder="Select or search area..."
              />
            </div>

            {/* BCS Class Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiLayers className="w-3.5 h-3.5 text-primary" /> BCS Class
              </label>
              <SearchableFilterInput
                value={bcsClass}
                onChange={setBcsClass}
                options={BCS_CLASSES}
                placeholder="Select BCS Class..."
              />
            </div>

            {/* Dosage Form Dropdown */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-main mb-2 flex items-center gap-1.5">
                <FiPackage className="w-3.5 h-3.5 text-primary" /> Dosage Form
              </label>
              <SearchableFilterInput
                value={dosageForm}
                onChange={setDosageForm}
                options={availableDosageForms}
                placeholder="Select or search form..."
              />
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
