import React from 'react';

interface ManufacturingSite {
  vendor: string;
  location: string;
  compound?: string;
}

interface ManufacturingSitesProps {
  manufacturingSites: ManufacturingSite[];
}

const ManufacturingSites: React.FC<ManufacturingSitesProps> = ({ manufacturingSites }) => {
  if (!manufacturingSites || manufacturingSites.length === 0) return null;

  // Group by compound if compound property exists
  const groupedSites = manufacturingSites.reduce((acc, site) => {
    const compound = site.compound || 'General';
    if (!acc[compound]) {
      acc[compound] = [];
    }
    acc[compound].push(site);
    return acc;
  }, {} as Record<string, ManufacturingSite[]>);

  return (
    <div className="mb-6 ml-6">
      <h2 id="section-3-2-1" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
        3.2.1 Manufacturing Sites
      </h2>
      {Object.entries(groupedSites).map(([compound, sites]) => (
        <div key={compound} className="mb-4">
          {compound !== 'General' && (
            <h3 className="text-lg font-semibold text-blue-600 mb-2">{compound}</h3>
          )}
          <div className="border-2 border-sky-400 rounded bg-white max-w-3xl">
            <table className="w-full text-sm text-black">
              <thead>
                <tr className="border-b border-blue-100">
                  <th className="w-1/2 p-3 text-black font-semibold text-left">Vendor</th>
                  <th className="w-1/2 p-3 text-black font-semibold text-left">Location</th>
                </tr>
              </thead>
              <tbody>
                {sites.map((site, index) => (
                  <tr key={index} className="border-b border-blue-100">
                    <td className="py-2 px-4">{site.vendor || 'N/A'}</td>
                    <td className="py-2 px-4">{site.location || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManufacturingSites;