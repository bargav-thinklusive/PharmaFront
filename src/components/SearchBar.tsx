import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { drugData } from "../sampleData/data";

interface SearchBarProps {
  value?: string;
  setValue?: (v: string) => void;
  initialCategory?: string;
  setCategory?: (cat: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  setValue,
  initialCategory,
  setCategory,
}) => {
  const [search, setSearch] = useState(value || "");
  const validCategories = [
    "all",
    "brandName",
    "genericName",
    "chemicalName",
    "structureName",
  ];
  const initialCat =
    initialCategory && validCategories.includes(initialCategory)
      ? initialCategory
      : "all";
  const [category, setCategoryState] = useState(initialCat);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hide suggestions when route changes
  useEffect(() => {
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

    drugData.forEach((item) => {
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
  }, [search, category]);

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
    if (setValue) setValue(newValue);
    setShowSuggestions(true);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setCategoryState(newCategory);
    if (setCategory) setCategory(newCategory);
    setSearch("");
    if (setValue) setValue("");
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
      className="w-full flex flex-col items-center mb-8 relative"
      ref={wrapperRef}
    >
      <form className="w-full flex justify-center" onSubmit={handleSubmit}>
        <div className="flex w-full max-w-2xl bg-white rounded shadow overflow-hidden">
          <input
            className="flex-1 px-6 py-4 text-lg border-0 focus:ring-0 focus:outline-none text-black caret-blue-700 bg-white placeholder-gray-400"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={handleInputChange}
            autoFocus
          />

          <div className="relative">
            <select
              className="px-6 py-4 text-lg bg-gray-100 border-0 focus:ring-0 focus:outline-none text-gray-700 font-medium border-l appearance-none pr-10"
              value={category}
              onChange={handleCategoryChange}
            >
              <option value="all">All</option>
              <option value="brandName">Brand </option>
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
        <div className="absolute top-full mt-1 w-full max-w-2xl bg-white border border-gray-200 rounded shadow-lg z-10">
          <ul className="max-h-[50vh] overflow-y-auto">
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
                    className="px-4 py-2 cursor-pointer hover:bg-blue-100"
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
