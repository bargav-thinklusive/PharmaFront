import React from 'react';

const About: React.FC = () => (
  <div className="h-full w-full bg-gray-50 flex flex-col">
    <div className="flex-1 py-16">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">About ChemBank</h2>
      <div className="max-w-4xl">
        <p className="text-gray-600 mb-6">
          ChemBank is a comprehensive chemical database that provides quick access to authoritative chemical information. Our platform helps researchers, students, and professionals find reliable data about compounds, taxonomy, and chemical genres.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Our Mission</h3>
            <p className="text-gray-600">
              To provide fast, reliable access to chemical information from trusted sources, supporting research and education in chemistry.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Features</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Comprehensive compound database</li>
              <li>• Taxonomy classifications</li>
              <li>• Genre-based searching</li>
              <li>• Authoritative sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default About;