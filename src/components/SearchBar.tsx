import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../context/UserContext";
import { debounce } from "lodash";
import { FiChevronDown } from "react-icons/fi";
import { trackDrugSearch } from "../utils/utils";

interface SearchBarProps {
  compact?: boolean;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "drugName", label: "Drug Name" },
  { value: "apiName", label: "API Name" },
  { value: "iupacName", label: "IUPAC Name" },
  { value: "innName", label: "INN Name" },
  { value: "cid", label: "CID" },
];

const SearchBar: React.FC<SearchBarProps> = ({ compact = false }) => {
  const [search, setSearch] = useState("");
  const [category, setCategoryState] = useState("all");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { drugsData } = useUser();

  const computeSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!search.trim()) {
      setSuggestions([]);
      return;
    }

    const q = search.trim().toLowerCase();
    const matches: any[] = [];
    const seen = new Set<string>();
    const dataSource = drugsData.length > 0 ? drugsData : [];

    dataSource?.forEach((item: any) => {
      if (category === "all") {
        const fields = [
          { text: item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || "", type: "drugName" },
          { text: item?.ProductOverview?.apiName || "", type: "apiName" },
          { text: item?.PhysicalChemicalProperties?.iupacName || "", type: "iupacName" },
          { text: item?.PhysicalChemicalProperties?.innName || "", type: "innName" },
          { text: item?.cid ? String(item.cid) : "", type: "cid" },
        ];
        fields.forEach((field) => {
          if (field.text && typeof field.text === "string" && field.text.toLowerCase().includes(q)) {
            const key = `${item.cid}-${field.text}`;
            if (!seen.has(key)) {
              seen.add(key);
              matches.push({ ...item, matchedField: field.type, matchedText: field.text });
            }
          }
        });
      } else if (category === "drugName") {
        const text = item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || "";
        if (text && text.toLowerCase().includes(q)) matches.push({ ...item, matchedText: text });
      } else if (category === "apiName") {
        const text = item?.ProductOverview?.apiName || "";
        if (text && text.toLowerCase().includes(q)) matches.push({ ...item, matchedText: text });
      } else if (category === "iupacName") {
        const text = item?.PhysicalChemicalProperties?.iupacName || "";
        if (text && text.toLowerCase().includes(q)) matches.push({ ...item, matchedText: text });
      } else if (category === "innName") {
        const text = item?.PhysicalChemicalProperties?.innName || "";
        if (text && text.toLowerCase().includes(q)) matches.push({ ...item, matchedText: text });
      } else if (category === "cid") {
        const text = item?.cid ? String(item.cid) : "";
        if (text && text.toLowerCase().includes(q)) matches.push({ ...item, matchedText: text });
      }
    });

    setSuggestions(matches);
  }, [search, category, drugsData]);

  const debouncedComputeSuggestions = useCallback(
    debounce(computeSuggestions, 300),
    [computeSuggestions]
  );

  useEffect(() => {
    debouncedComputeSuggestions();
  }, [debouncedComputeSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // Find matching drugs to count search of drug
      const query = search.trim().toLowerCase();
      const matchedDrugs = (drugsData || []).filter((item: any) => {
        const drugName = (item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.drugName || "").toLowerCase();
        const apiName = (item?.ProductOverview?.apiName || "").toLowerCase();
        const iupacName = (item?.PhysicalChemicalProperties?.iupacName || "").toLowerCase();
        const innName = (item?.PhysicalChemicalProperties?.innName || "").toLowerCase();
        const cid = item?.cid ? String(item.cid).toLowerCase() : "";

        if (category === "all") {
          return drugName.includes(query) || apiName.includes(query) || iupacName.includes(query) || innName.includes(query) || cid.includes(query);
        } else if (category === "drugName") {
          return drugName.includes(query);
        } else if (category === "apiName") {
          return apiName.includes(query);
        } else if (category === "iupacName") {
          return iupacName.includes(query);
        } else if (category === "innName") {
          return innName.includes(query);
        } else if (category === "cid") {
          return cid.includes(query);
        }
        return false;
      });

      if (matchedDrugs.length > 0) {
        matchedDrugs.forEach((item: any) => {
          const exactName = item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.drugName;
          if (exactName) {
            trackDrugSearch(exactName);
          }
        });
      } else {
        // Fallback: track raw search query if no drugs matched
        trackDrugSearch(search.trim());
      }

      const searchPath = `/${category}/${encodeURIComponent(search.trim())}`;
      if (location.pathname === "/drug-form" && (window as any).triggerSaveDraftNavigationBlocker) {
        (window as any).triggerSaveDraftNavigationBlocker(searchPath);
      } else {
        navigate(searchPath);
      }
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleCategorySelect = (value: string) => {
    setCategoryState(value);
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
    setCategoryOpen(false);
  };

  const handleSelect = (item: any) => {
    const exactName =
      item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.drugName || item?.cid || "";
    if (exactName) {
      trackDrugSearch(exactName);
    }
    const searchText =
      item.matchedText || item?.ProductOverview?.drugName || item?.ProductOverview?.brandName || item?.cid || "";
    const searchPath = `/${category}/${encodeURIComponent(searchText)}`;
    if (location.pathname === "/drug-form" && (window as any).triggerSaveDraftNavigationBlocker) {
      (window as any).triggerSaveDraftNavigationBlocker(searchPath);
    } else {
      navigate(searchPath);
    }
    setSearch(searchText);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(ev.target as Node)) {
        setShowSuggestions(false);
        setCategoryOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const selectedLabel = CATEGORIES.find((c) => c.value === category)?.label || "All";

  return (
    <div
      className={`w-full flex flex-col items-center ${compact ? "mb-0" : "mb-8"} relative`}
      ref={wrapperRef}
    >
      <form className="w-full flex justify-center" onSubmit={handleSubmit}>
        <div className="flex w-full max-w-2xl bg-white rounded shadow" style={{ overflow: "visible" }}>

          {/* Search input */}
          <div className="flex-1 relative overflow-hidden rounded-l">
            <input
              className="w-full px-3 sm:px-6 py-2 sm:py-4 text-base sm:text-lg border-0 focus:ring-0 focus:outline-none text-main caret-primary bg-white placeholder-[#94A3B8] pr-12"
              type="text"
              placeholder="Search..."
              value={search}
              onChange={handleInputChange}
              autoFocus
            />
            {search && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <RxCross2 />
              </button>
            )}
          </div>

          {/* Custom category dropdown trigger */}
          <div className="relative flex-shrink-0 border-l-2 border-l-primary">
            <button
              type="button"
              onClick={() => setCategoryOpen((o) => !o)}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-4 h-full text-sm sm:text-base font-bold text-primary bg-white hover:bg-primary-light transition-colors cursor-pointer whitespace-nowrap rounded-r"
            >
              {selectedLabel}
              <FiChevronDown
                className={`w-3.5 h-3.5 text-primary transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Options list */}
            {categoryOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-border-main rounded-xl shadow-xl z-[1002] min-w-[140px] overflow-hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors cursor-pointer ${
                      category === cat.value
                        ? "bg-primary text-white"
                        : "text-main hover:bg-primary-light hover:text-primary"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && search.trim() && (
        <div className="absolute top-full mt-1 w-full max-w-2xl bg-white border border-border-main rounded-xl shadow-lg z-[1001]">
          <ul className="max-h-[50vh] overflow-y-auto">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => {
                const displayText =
                  item.matchedText ||
                  item?.ProductOverview?.drugName ||
                  item?.ProductOverview?.brandName ||
                  item?.cid ||
                  "";
                return (
                  <li
                    key={item.cid + "-" + index + "-" + String(displayText)}
                    className="px-4 py-2.5 cursor-pointer hover:bg-primary-light hover:text-primary text-main transition-colors text-sm font-medium border-b border-border-main last:border-0"
                    onClick={() => handleSelect(item)}
                  >
                    {displayText}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-body text-center text-sm">
                No items found for "{search}" in{" "}
                {category === "all" ? "any category" : category.replace(/([A-Z])/g, " $1").toLowerCase()}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;