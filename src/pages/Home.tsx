import { useNavigate } from 'react-router';
import SearchBar from '../components/SearchBar';


const Home: React.FC = () => {
const navigate=useNavigate()

  return (
    <div className="min-h-[calc(100vh-120px)] w-full bg-gradient-to-b from-blue-900 to-blue-600 flex flex-col  px-4">
      <div className="flex flex-col items-center w-full max-w-4xl mx-auto mt-10">
        <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-center drop-shadow-lg">
          Explore Chemistry
        </h1>
        <p className="text-white text-lg mb-4 text-center drop-shadow max-w-2xl">
          Quickly find chemical information from authoritative sources
        </p>

        {/* Search bar container */}
        <div className="w-full max-w-2xl">
          <SearchBar   />
        </div>
        <div>
           <button onClick={()=>navigate("/drug-form")} className='bg-blue-500 text-white p-1 rounded cursor-pointer'>Add Drug</button>
        </div>
      </div>
    </div>
  );
};

export default Home;

