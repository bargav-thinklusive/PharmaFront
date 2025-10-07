import React from 'react';
import UniversalDataRenderer from '../Universal/UniversalDataRenderer';

interface ManufacturingSitesProps {
  manufacturingSites: any[];
}

const ManufacturingSites: React.FC<ManufacturingSitesProps> = ({ manufacturingSites }) => {
  if (!manufacturingSites || manufacturingSites.length === 0) return null;

  return (
    <div className="mb-6 ml-6">
      <h2 id="section-3-2-1" className="text-xl font-bold border-blue-400 border-b-3 pb-1 mb-4">
        3.2.1 Manufacturing Sites
      </h2>
      <UniversalDataRenderer
        data={manufacturingSites}
        sectionId="section-3-2-1"
      />
    </div>
  );
};

export default ManufacturingSites;