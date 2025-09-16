import SearchBar from '../components/SearchBar';
import { useState } from 'react';

const Home: React.FC = () => {
  const [category, setCategory] = useState('compound');

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col items-center"
      style={{
        paddingTop: 64, // header height
        paddingBottom: 64, // footer height
        boxSizing: 'border-box',
      }}
    >
      <div
        className="flex flex-col items-center w-full flex-1"
        style={{
          width: '100%',
          maxWidth: 900,
          height: 'calc(100vh - 128px)', // header + footer
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <h1 className="text-white text-5xl font-bold mt-2 mb-2 text-center drop-shadow-lg">
          Explore Chemistry
        </h1>
        <p className="text-white text-lg mb-4 text-center drop-shadow">
          Quickly find chemical information from authoritative sources
        </p>
        <div className="w-full flex flex-col items-center" style={{ marginTop: 0 }}>
          {/* Autocomplete search bar */}
          <SearchBar initialCategory={category} setCategory={setCategory} />
        </div>
      </div>
    </div>
  );
};

export default Home;
