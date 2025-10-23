import React from 'react';

const Contacts: React.FC = () => (
  <div className="h-full w-full bg-gray-50 flex flex-col px-4">
    <div className="flex-1 py-8 sm:py-16 max-w-6xl mx-auto w-full">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 text-center sm:text-left">Contacts</h2>
      <div className="max-w-4xl">
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          This is the Contacts page. Get in touch with our team for any questions about CMCINTEL.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">General Inquiries</h3>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Email: info@CMCINTEL.com</p>
            <p className="text-gray-600 text-sm sm:text-base">Phone: +1 (555) 123-4567</p>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
            <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-800">Technical Support</h3>
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Email: support@CMCINTEL.com</p>
            <p className="text-gray-600 text-sm sm:text-base">Phone: +1 (555) 123-4568</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Contacts;