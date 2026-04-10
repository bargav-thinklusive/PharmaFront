import { useState } from 'react';
import SearchBar from '../SearchBar';
import AddDrugModal from '../CompoundForm/AddDrugModal';

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col px-4 sm:px-6">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-6 sm:mt-10">
        <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-center drop-shadow-lg">
          Explore Chemistry
        </h1>
        <p className="text-white text-sm sm:text-lg mb-4 text-center drop-shadow max-w-2xl px-2">
          Quickly find chemical information from authoritative sources
        </p>

        {/* Search bar container */}
        <div className="w-full max-w-2xl">
          <SearchBar />
        </div>
        <div className="mt-3">
          <button
            onClick={() => setShowModal(true)}
            className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer text-sm sm:text-base font-medium hover:bg-blue-400 transition-colors'
          >
            Add Drug
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && <AddDrugModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Home;
