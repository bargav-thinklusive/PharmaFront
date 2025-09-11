import React from 'react';
import type { ReactNode } from 'react';

interface BodyProps {
  children: ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => (
  <main style={{ minHeight: '80vh', padding: '2rem', background: '#f5f5f5', width: '100vw', margin: 0 }}>
    {children}
  </main>
);

export default Body;
