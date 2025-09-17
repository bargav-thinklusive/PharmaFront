// import React from 'react';
// import type { ReactNode } from 'react';
// import { useLocation } from 'react-router';

// interface BodyProps {
//   children: ReactNode;
// }

// const Body: React.FC<BodyProps> = ({ children }) => {
//     const location = useLocation();
//   const isLoginPage = location.pathname === '/login';
//   return(
// <main style={{ minHeight: '100vh',  background: '#f5f5f5', width: '100vw', margin: 0,paddingTop: `${isLoginPage?"":"65px"}` }}>
//     {children}
//   </main>
//   )
// }

  

// export default Body;



import React from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router';

interface BodyProps {
  children: ReactNode;
}

const Body: React.FC<BodyProps> = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  
  return (
    <main style={{ 
      minHeight: '100vh',
      background: isLoginPage ? 'transparent' : '#f5f5f5', // Remove background on login page
      width: '100vw',
      margin: 0,
      paddingTop: `${isLoginPage ? "0" : "65px"}`
    }}>
      {children}
    </main>
  );
};

export default Body;