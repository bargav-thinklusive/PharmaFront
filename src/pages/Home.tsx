
import SearchBar from '../components/SearchBar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { maindata } from '../sampleData/data';

const Home: React.FC = () => {
  const [category, setCategory] = useState('compound');


  // Get the list for the selected category
  let items: any[] = [];
  if (category === 'compound') {
    const comp = maindata.find((d: any) => d.Compound);
    items = (comp?.Compound as any[]) || [];
  } else if (category === 'taxonomy') {
    const tax = maindata.find((d: any) => d.Taxonomy);
    items = (tax?.Taxonomy as any[]) || [];
  } else if (category === 'genre') {
    const gen = maindata.find((d: any) => d.Genre);
    items = (gen?.Genre as any[]) || [];
  }

  const navigate = useNavigate();


  // Handler for SearchBar category change
  const handleCategoryChange = (cat: string) => setCategory(cat);

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
          <SearchBar initialCategory={category} setCategory={handleCategoryChange} />
        </div>
        {/* List based on category */}
        <div
          className="w-full max-w-2xl mt-2 bg-white/80 rounded shadow p-4 flex flex-col"
          style={{
            flex: 1,
            minHeight: 0,
            overflow: 'hidden',
            marginBottom: 0,
          }}
        >
          <h2 className="text-xl font-bold mb-2 text-blue-900 capitalize">
            {category} List
          </h2>
          {items.length === 0 ? (
            <div className="text-gray-500">No data available.</div>
          ) : (
            <div style={{ height: '100%', maxHeight: '100%', overflowY: 'auto' }}>
              <ul className="divide-y divide-blue-100">
                {items.map((item: any) => {
                  const searchText = item.Record.RecordTitle || item.Record.RecordNumber;
                  return (
                    <li
                      key={item.Record.RecordNumber}
                      className="py-2 cursor-pointer hover:bg-blue-100 rounded px-2"
                      onClick={() => navigate(`/${category}/${encodeURIComponent(searchText)}`)}
                      title={`Go to ${category} ${searchText}`}
                    >
                      <span className="font-semibold text-black">
                        {searchText}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
