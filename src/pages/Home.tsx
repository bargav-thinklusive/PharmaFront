
import SearchBar from '../components/SearchBar';
import { useState } from 'react';

const Home: React.FC = () => {
  const [category, setCategory] = useState('compound');

  return (
    <div className="h-full w-full bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
          Explore Chemistry
        </h1>
        <p className="text-white text-lg mb-8 text-center drop-shadow max-w-2xl">
          Quickly find chemical information from authoritative sources
        </p>
        
        {/* Search bar container */}
        <div className="w-full max-w-2xl">
          <SearchBar initialCategory={category} setCategory={setCategory} />
        </div>
      </div>
    </div>
  );
};

export default Home;