import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense } from 'react';
import AuthenticatedHeader from '../components/layout/AuthenticatedHeader';
import BodyWrapper from '../components/layout/BodyWrapper';
import Footer from '../components/layout/Footer';
import { routesConfig } from './routesConfig';
import Loader from '../components/Loader';
import PublicHeader from '../components/layout/PublicHeader';

const AppWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isHome1Page = location.pathname === "/" || location.pathname === "/what-we-do" || location.pathname === "/areas-served";
  const showPublicHeader = isHome1Page || location.state?.headerType === 'header1';

  return (
    <div className="min-h-screen flex flex-col">
      {!isLoginPage && (showPublicHeader ? <PublicHeader /> : <AuthenticatedHeader />)}

      <BodyWrapper>
        <Suspense fallback={<Loader fullScreen message="Loading page..." />}>
          <Routes>
            {routesConfig.map(({ path, element }, index) => (
              <Route key={`${path}-${index}`} path={path} element={element} />
            ))}
          </Routes>
        </Suspense>
      </BodyWrapper>

      {!isLoginPage && <Footer />}
    </div>
  );
};

export default AppWrapper;
