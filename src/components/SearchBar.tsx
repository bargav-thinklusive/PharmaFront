import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import { useUser } from "../context/UserContext";
import { debounce } from "lodash";

interface SearchBarProps {
  compact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  compact = false,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategoryState] = useState("all");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { drugsData } = useUser();


  // Compute suggestions with debouncing
  const computeSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, [location.pathname]);

  // Compute suggestions
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
          { text: item?.marketInformation?.drugName || item?.marketInformation?.brandName || item?.drugName || "", type: "drugName" },
          { text: item?.marketInformation?.apiName || item?.marketInformation?.genericName || item?.apiName || "", type: "apiName" },
          {
            text: (() => {
              const chemicalName = item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName;
              if (typeof chemicalName === 'string') return chemicalName;
              if (typeof chemicalName === 'object') {
                const keys = Object.keys(chemicalName).filter((key: any) => typeof key === 'string' && key.trim());
                return keys.join(' ');
              }
              return "";
            })(),
            type: "chemicalName",
          },
          {
            text: (() => {
              const structureName = item?.drugSubstance?.physicalAndChemicalProperties?.structureName;
              if (typeof structureName === 'string') return structureName;
              if (typeof structureName === 'object') {
                const values = Object.values(structureName).filter((val: any) => typeof val === 'string' && val.trim());
                return values.join(' ');
              }
              return "";
            })(),
            type: "structureName",
          },
          { text: item?.cid || "", type: "cid" },
        ];

        fields.forEach((field) => {
          if (field.text && typeof field.text === 'string' && field.text.toLowerCase().includes(q)) {
            const key = `${item.cid}-${field.text}`;
            if (!seen.has(key)) {
              seen.add(key);
              matches.push({
                ...item,
                matchedField: field.type,
                matchedText: field.text,
              });
            }
          }
        });
      } else if (category === "drugName") {
        const text = item?.marketInformation?.drugName || item?.marketInformation?.brandName || item?.drugName || "";
        if (text && text.toLowerCase().includes(q)) {
          matches.push({ ...item, matchedText: text });
        }
      } else if (category === "apiName") {
        const text = item?.marketInformation?.apiName || item?.marketInformation?.genericName || item?.apiName || "";
        if (text && text.toLowerCase().includes(q)) {
          matches.push({ ...item, matchedText: text });
        }
      } else if (category === "chemicalName") {
        const text =
          item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName || "";
        if (text && text.toLowerCase().includes(q)) {
          matches.push({ ...item, matchedText: text });
        }
      } else if (category === "structureName") {
        const structureName = item?.drugSubstance?.physicalAndChemicalProperties?.structureName;
        if (structureName) {
          if (typeof structureName === 'string' && structureName.toLowerCase().includes(q)) {
            matches.push({ ...item, matchedText: structureName });
          } else if (typeof structureName === 'object') {
            Object.values(structureName).forEach((val: any) => {
              if (typeof val === 'string' && val.trim() && val.toLowerCase().includes(q)) {
                matches.push({ ...item, matchedText: val });
              }
            });
            // Also check concatenated values
            const concatenated = Object.values(structureName).filter((val: any) => typeof val === 'string' && val.trim()).join(' ');
            if (concatenated && concatenated.toLowerCase().includes(q)) {
              matches.push({ ...item, matchedText: concatenated });
            }
          }
        }
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
      navigate(`/${category}/${encodeURIComponent(search.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearch(newValue);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategoryState(newCategory);
    setSearch("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSelect = (item: any) => {
    const searchText =
      item.matchedText || item?.marketInformation?.drugName || item?.marketInformation?.brandName || item?.drugName || item?.cid || "";
    navigate(`/${category}/${encodeURIComponent(searchText)}`);
    setSearch(searchText);
    setShowSuggestions(false);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(ev.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      className={`w-full flex flex-col items-center ${compact ? 'mb-0' : 'mb-8'} relative`}
      ref={wrapperRef}
    >
      <form className="w-full flex justify-center" onSubmit={handleSubmit}>
        <div className="flex w-full max-w-2xl bg-white rounded shadow overflow-hidden">
          <div className="flex-1 relative">
            <input
              className="w-full px-6 py-4 text-lg border-0 focus:ring-0 focus:outline-none text-black caret-blue-700 bg-white placeholder-gray-400 pr-12"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
              >
                <RxCross2 />
              </button>
            )}
          </div>
          <div className="relative">
            <select
              className="px-6 py-4 text-lg bg-gray-100 border-0 focus:ring-0 focus:outline-none text-gray-700 font-medium border-l appearance-none pr-10"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">All</option>
              <option value="drugName">Drug Name</option>
              <option value="apiName">API Name</option>
              <option value="chemicalName">Chemical</option>
              <option value="structureName">Structure</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-600">
              ▼
            </span>
          </div>
        </div>
      </form>

      {/* Suggestions dropdown with scroll */}
      {showSuggestions && search.trim() && (
        <div className="absolute top-full mt-1 w-full max-w-2xl bg-white border border-gray-200 rounded shadow-lg z-[1001]">
          <ul className="max-h-[50vh] overflow-y-auto text-black">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => {
                const displayText =
                  item.matchedText ||
                  item?.marketInformation?.drugName ||
                  item?.marketInformation?.brandName ||
                  item?.drugName ||
                  item?.cid ||
                  "";
                return (
                  <li
                    key={item.cid + "-" + index + "-" + String(displayText)}
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100 text-black hover:text-black"
                    onClick={() => handleSelect(item)}
                  >
                    {displayText}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-gray-500 text-center">
                No items found for "{search}" in{" "}
                {category === "all"
                  ? "any category"
                  : category.replace(/([A-Z])/g, " $1").toLowerCase()}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;