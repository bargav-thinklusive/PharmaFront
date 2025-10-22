import React from 'react';
import { useLocation } from 'react-router-dom';

interface BodyProps {
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/home';

  return (
    <main className={`flex-1 ${isHomePage ? 'pt-16' : 'pt-40 sm:pt-16'}`}> {/* pt-16 for home, pt-20/16 for other pages */}
      {children}
    </main>
  );
};

export default Body;