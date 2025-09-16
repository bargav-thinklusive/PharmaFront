import React from 'react';
import type { ReactNode } from 'react';

interface BodyProps {
  children: ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => (
  <main style={{ minHeight: '100vh',  background: '#f5f5f5', width: '100vw', margin: 0,paddingTop: "65px" }}>
    {children}
  </main>
);

export default Body;
