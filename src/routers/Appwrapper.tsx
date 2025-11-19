import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import Header from '../pages/Header';
import Body from '../pages/Body';
import Footer from '../pages/Footer';
import { routesConfig } from './routesConfig';
import Loader from '../components/Loader';
import Header1 from '../pages/Header1';

const AppWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isHome1Page = location.pathname === "/" || location.pathname === "/what-we-do" || location.pathname === "/areas-served";
  const showHeader1 = isHome1Page || location.state?.headerType === 'header1';

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && (showHeader1 ? <Header1 /> : <Header />)}

      <Body>
        <Suspense fallback={<Loader fullScreen message="Loading page..." />}>
          <Routes>

            {routesConfig.map(({ path, element }, index) => (
              <Route key={`${path}-${index}`} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </Body>

      {!isLoginPage && <Footer />}
    </div>
  );
};

export default AppWrapper;