import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToHome = () => {
    navigate('/home');
  };

  const handleContact = () => {
    navigate('/contacts');
  };

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          Page not found
        </h1>
        <p className="mt-6 text-lg font-medium text-gray-500 sm:text-xl/8">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            onClick={handleGoToHome}
            style={{ backgroundColor: '#36b669' }}
            className="rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600"
          >
            Go back home
          </button>
          <button
            onClick={handleContact}
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            Contact support <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
