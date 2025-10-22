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
const dataSource = drugsData.length > 0 ? drugsData :[]

    dataSource?.forEach((item:any) => {
      if (category === "all") {
        const fields = [
          { text: item?.marketInformation?.brandName || "", type: "brandName" },
          { text: item?.marketInformation?.genericName || "", type: "genericName" },
          {
            text:
              item?.drugSubstance?.physicalAndChemicalProperties?.chemicalName ||
              "",
            type: "chemicalName",
          },
          {
            text:
              item?.drugSubstance?.physicalAndChemicalProperties?.structureName ||
              "",
            type: "structureName",
          },
          { text: item?.cid || "", type: "cid" },
          //{ text: item?.marketInformation?.indication || "", type: "indication" },
        ];

        fields.forEach((field) => {
          if (field.text && field.text.toLowerCase().includes(q)) {
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
      } else if (category === "brandName") {
        const text = item?.marketInformation?.brandName || "";
        if (text && text.toLowerCase().includes(q)) {
          matches.push({ ...item, matchedText: text });
        }
      } else if (category === "genericName") {
        const text = item?.marketInformation?.genericName || "";
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
        const text =
          item?.drugSubstance?.physicalAndChemicalProperties?.structureName || "";
        if (text && text.toLowerCase().includes(q)) {
          matches.push({ ...item, matchedText: text });
        }
      }
    });

    //setSuggestions(matches.slice(0, 50)); // limit to 50 results
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
      item.matchedText || item?.marketInformation?.brandName || item?.cid || "";
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
        <div className="flex flex-col sm:flex-row w-full max-w-2xl bg-white rounded shadow overflow-hidden">
          <div className="flex-1 relative">
            <input
              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-0 focus:ring-0 focus:outline-none text-black caret-blue-700 bg-white placeholder-gray-400 pr-12"
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
              className="px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg bg-gray-100 border-0 focus:ring-0 focus:outline-none text-gray-700 font-medium border-t sm:border-t-0 sm:border-l appearance-none pr-10 w-full sm:w-auto"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">All</option>
              <option value="brandName">Brand</option>
              <option value="genericName">Generic</option>
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
        <div className="absolute top-full mt-1 w-full max-w-2xl bg-white border border-gray-200 rounded shadow-lg z-[1001] left-0 right-0 mx-auto">
          <ul className="max-h-[40vh] sm:max-h-[50vh] overflow-y-auto text-black">
            {suggestions.length > 0 ? (
              suggestions.map((item, index) => {
                const displayText =
                  item.matchedText ||
                  item?.marketInformation?.brandName ||
                  item?.cid ||
                  "";
                return (
                  <li
                    key={item.cid + "-" + index + "-" + String(displayText)}
                    className="px-3 sm:px-4 py-2 cursor-pointer hover:bg-blue-100 text-black hover:text-black text-sm sm:text-base"
                    onClick={() => handleSelect(item)}
                  >
                    {displayText}
                  </li>
                );
              })
            ) : (
              <li className="px-4 py-3 text-gray-500 text-center text-sm sm:text-base">
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