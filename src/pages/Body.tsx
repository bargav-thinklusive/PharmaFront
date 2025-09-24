import React from 'react';

interface BodyProps {
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <main className="flex-1 pt-16"> {/* pt-16 accounts for fixed header height */}
      {children}
    </main>
  );
};

export default Body;