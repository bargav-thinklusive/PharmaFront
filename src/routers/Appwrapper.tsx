import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '../pages/Header';
import Body from '../pages/Body';
import Footer from '../pages/Footer';
import { routesConfig } from './routesConfig';

const AppWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login'|| location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoginPage={isLoginPage} />

      <Body>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {routesConfig.map(({ path, element }, index) => (
            <Route key={`${path}-${index}`} path={path} element={element} />
          ))}
        </Routes>
      </Body>

      {!isLoginPage && <Footer />}
    </div>
  );
};

export default AppWrapper;