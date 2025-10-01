import React from 'react';

interface ManufacturingSite {
  vendor: string;
  location: string;
}

interface ManufacturingSitesProps {
  manufacturingSites: ManufacturingSite[];
}

const ManufacturingSites: React.FC<ManufacturingSitesProps> = ({ manufacturingSites }) => {
  if (!manufacturingSites || manufacturingSites.length === 0) return null;

  return (
    <div className="mb-6 ml-6">
      <h2 id="section-3-2-1" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
        3.2.1 Manufacturing Sites
      </h2>
      <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
        <table className="w-full text-sm text-black">
          <thead>
            <tr className="border-b border-blue-100">
              <th className="w-1/2 p-3 text-black font-semibold text-left">Vendor</th>
              <th className="w-1/2 p-3 text-black font-semibold text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            {manufacturingSites.map((site, index) => (
              <tr key={index} className="border-b border-blue-100">
                <td className="py-2 px-4">{site.vendor || 'N/A'}</td>
                <td className="py-2 px-4">{site.location || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManufacturingSites;