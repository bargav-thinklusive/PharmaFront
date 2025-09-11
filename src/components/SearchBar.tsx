


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';



interface SearchBarProps {
  value?: string;
  setValue?: (v: string) => void;
  initialCategory?: string;
  setCategory?: (cat: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, setValue, initialCategory, setCategory }) => {
  const [search, setSearch] = useState(value || '');
  const [category, setCategoryState] = useState(initialCategory || 'compound');
  const navigate = useNavigate();

  // Keep local state in sync with props
  React.useEffect(() => {
    if (typeof value === 'string' && value !== search) setSearch(value);
  }, [value]);
  React.useEffect(() => {
    if (initialCategory && initialCategory !== category) setCategoryState(initialCategory);
  }, [initialCategory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/${category}/${encodeURIComponent(search.trim())}`);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (setValue) setValue(e.target.value);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryState(e.target.value);
    if (setCategory) setCategory(e.target.value);
  };

  return (
    <form className="w-full flex justify-center mb-8" onSubmit={handleSubmit}>
      <div className="flex w-full max-w-2xl bg-white rounded shadow overflow-hidden">
        <input
          className="flex-1 px-6 py-4 text-lg border-0 focus:ring-0 focus:outline-none text-black caret-blue-700 bg-white placeholder-gray-400"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleInputChange}
          autoFocus
        />
        <select
          className="px-6 py-4 text-lg bg-gray-100 border-0 focus:ring-0 focus:outline-none text-gray-700 font-medium border-l"
          value={category}
          onChange={handleCategoryChange}
        >
          <option value="compound">Compound</option>
          <option value="taxonomy">Taxonomy</option>
          <option value="genre">Genre</option>
        </select>
      </div>
    </form>
  );
};

export default SearchBar;
