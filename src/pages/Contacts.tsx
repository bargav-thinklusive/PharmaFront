import React from 'react';

const Contacts: React.FC = () => (
  <div className="h-full w-full bg-gray-50 flex flex-col">
    <div className="flex-1 py-16">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Contacts</h2>
      <div className="max-w-4xl">
        <p className="text-gray-600 mb-6">
          This is the Contacts page. Get in touch with our team for any questions about ChemBank.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">General Inquiries</h3>
            <p className="text-gray-600 mb-2">Email: info@chembank.com</p>
            <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Technical Support</h3>
            <p className="text-gray-600 mb-2">Email: support@chembank.com</p>
            <p className="text-gray-600">Phone: +1 (555) 123-4568</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contacts;