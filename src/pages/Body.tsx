import React from 'react';

interface BodyProps {
  children: React.ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  return (
    <main className="flex-1 overflow-auto">
      {children}
    </main>
  );
};

export default Body;