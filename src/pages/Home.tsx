import SearchBar from '../components/SearchBar';


const Home: React.FC = () => {


  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col px-4 py-4">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-0 sm:mt-0">
        <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
          Explore Chemistry
        </h1>
        <p className="text-white text-base sm:text-lg mb-6 sm:mb-4 text-center drop-shadow max-w-2xl px-4">
          Quickly find chemical information from authoritative sources
        </p>

        {/* Search bar container */}
        <div className="w-full max-w-2xl px-4">
          <SearchBar   />
        </div>
      </div>
    </div>
  );
};

export default Home;

