// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { maindata } from "../sampleData/data";

// interface SearchBarProps {
//   value?: string;
//   setValue?: (v: string) => void;
//   initialCategory?: string;
//   setCategory?: (cat: string) => void;
// }

// const SearchBar: React.FC<SearchBarProps> = ({
//   value,
//   setValue,
//   initialCategory,
//   setCategory,
// }) => {
//   const [search, setSearch] = useState(value || "");
//   const [category, setCategoryState] = useState(initialCategory || "compound");
//   const [suggestions, setSuggestions] = useState<any[]>([]);
//   const [showSuggestions, setShowSuggestions] = useState(true);

//   const navigate = useNavigate();
//   const location = useLocation();
//   const wrapperRef = useRef<HTMLDivElement>(null);

//   // Hide suggestions whenever the route (pathname) changes
//   useEffect(() => {
//     setShowSuggestions(false);
//     setSuggestions([]); // just in case
//   }, [location.pathname]);

//   // sync prop value -> local search state
//   useEffect(() => {
//     if (typeof value === "string" && value !== search) setSearch(value);
//   }, [value]);

//   useEffect(() => {
//     if (initialCategory && initialCategory !== category)
//       setCategoryState(initialCategory);
//   }, [initialCategory]);

//   // compute suggestions only when showSuggestions is true
//   useEffect(() => {
//     if (!search.trim() || !showSuggestions) {
//       setSuggestions([]);
//       return;
//     }

//     let items: any[] = [];
//     if (category === "compound") {
//       const comp = maindata.find((d: any) => d.Compound);
//       items = (comp?.Compound as any[]) || [];
//     } else if (category === "taxonomy") {
//       const tax = maindata.find((d: any) => d.Taxonomy);
//       items = (tax?.Taxonomy as any[]) || [];
//     } else if (category === "genre") {
//       const gen = maindata.find((d: any) => d.Genre);
//       items = (gen?.Genre as any[]) || [];
//     }

//     const q = search.toLowerCase();
//     const matches = items.filter((item) => {
//       const title =
//         (item?.Record?.RecordTitle as string) ||
//         String(item?.Record?.RecordNumber || "");
//       return title.toLowerCase().includes(q);
//     });

//     setSuggestions(matches.slice(0, 8));
//   }, [search, category, showSuggestions]);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate(`/${category}/${encodeURIComponent(search.trim())}`);
//       setShowSuggestions(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//     if (setValue) setValue(e.target.value);
//     setShowSuggestions(true); // user typed — show suggestions again
//   };

//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setCategoryState(e.target.value);
//     if (setCategory) setCategory(e.target.value);
//     setShowSuggestions(true);
//   };

//   const handleSelect = (item: any) => {
//     const searchText = item.Record.RecordTitle || item.Record.RecordNumber;
//     navigate(`/${category}/${encodeURIComponent(searchText)}`);
//     setSearch(searchText);
//     setShowSuggestions(false);
//   };

//   // close dropdown when clicking outside
//   useEffect(() => {
//     const onDocClick = (ev: MouseEvent) => {
//       if (wrapperRef.current && !wrapperRef.current.contains(ev.target as Node)) {
//         setShowSuggestions(false);
//       }
//     };
//     document.addEventListener("mousedown", onDocClick);
//     return () => document.removeEventListener("mousedown", onDocClick);
//   }, []);

//   return (
//     <div className="w-full flex flex-col items-center mb-8 relative" ref={wrapperRef}>
//       <form className="w-full flex justify-center" onSubmit={handleSubmit}>
//         <div className="flex w-full max-w-2xl bg-white rounded shadow overflow-hidden">
//           <input
//             className="flex-1 px-6 py-4 text-lg border-0 focus:ring-0 focus:outline-none text-black caret-blue-700 bg-white placeholder-gray-400"
//             type="text"
//             placeholder="Search..."
//             value={search}
//             onChange={handleInputChange}
//             autoFocus
//           />
//           <select
//             className="px-6 py-4 text-lg bg-gray-100 border-0 focus:ring-0 focus:outline-none text-gray-700 font-medium border-l"
//             value={category}
//             onChange={handleCategoryChange}
//           >
//             <option value="compound">Compound</option>
//             <option value="taxonomy">Taxonomy</option>
//             <option value="genre">Genre</option>
//           </select>
//         </div>
//       </form>

//       {/* Suggestions dropdown */}
//       {showSuggestions && suggestions.length > 0 && (
//         <ul className="absolute top-full mt-1 w-full max-w-2xl bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
//           {suggestions.map((item) => {
//             const searchText = item.Record.RecordTitle || item.Record.RecordNumber;
//             return (
//               <li
//                 key={item.Record.RecordNumber + "-" + String(searchText)}
//                 className="px-4 py-2 cursor-pointer hover:bg-blue-100"
//                 onClick={() => handleSelect(item)}
//               >
//                 {searchText}
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default SearchBar;



import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { sampleDrugsData } from "../sampleData/data";

interface SearchBarProps {
  value?: string;
  setValue?: (v: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, setValue }) => {
  const [search, setSearch] = useState(value || "");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hide suggestions whenever the route changes
  useEffect(() => {
    setShowSuggestions(false);
    setSuggestions([]);
  }, [location.pathname]);

  // Sync prop value with local state
  useEffect(() => {
    if (typeof value === "string" && value !== search) setSearch(value);
  }, [value]);

  // Compute suggestions
  useEffect(() => {
    if (!search.trim() || !showSuggestions) {
      setSuggestions([]);
      return;
    }

    const q = search.toLowerCase();
    const matches = sampleDrugsData.filter((drug) => {
      const brand = drug.MarketInformation.BrandName.toLowerCase();
      const generic = drug.MarketInformation.GenericName.toLowerCase();
      const indication = drug.MarketInformation.Indication.toLowerCase();
      const cid = drug.cid.toLowerCase();

      return (
        brand.includes(q) ||
        generic.includes(q) ||
        indication.includes(q) ||
        cid.includes(q)
      );
    });

    setSuggestions(matches.slice(0, 8));
  }, [search, showSuggestions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    // Find drug by brand name first
    const found = sampleDrugsData.find(
      (drug) =>
        drug.MarketInformation.BrandName.toLowerCase() === search.toLowerCase()
    );

    if (found) {
      navigate(`/drug/${encodeURIComponent(found.MarketInformation.BrandName)}`);
    } else {
      navigate(`/drug/${encodeURIComponent(search.trim())}`);
    }

    setShowSuggestions(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (setValue) setValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleSelect = (drug: any) => {
    const brandName = drug.MarketInformation.BrandName;
    navigate(`/drug/${encodeURIComponent(brandName)}`);
    setSearch(brandName);
    setShowSuggestions(false);
  };

  // Close dropdown when clicking outside
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
            placeholder="Search drugs by Brand, Generic, Indication, or CID..."
            value={search}
            onChange={handleInputChange}
            autoFocus
          />
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute top-full mt-1 w-full max-w-2xl bg-white border border-gray-200 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
          {suggestions.map((drug) => {
            const brand = drug.MarketInformation.BrandName;
            const generic = drug.MarketInformation.GenericName;
            const indication = drug.MarketInformation.Indication;
            return (
              <li
                key={drug.cid}
                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelect(drug)}
              >
                <div className="font-medium">{brand}</div>
                <div className="text-sm text-gray-600">
                  {generic} — {indication}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
