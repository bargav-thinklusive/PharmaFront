import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import AuthenticatedHeader from '../components/layout/AuthenticatedHeader';
import BodyWrapper from '../components/layout/BodyWrapper';
import Footer from '../components/layout/Footer';
import { routesConfig } from './routesConfig';
import Loader from '../components/Loader';
import PublicHeader from '../components/layout/PublicHeader';
import TokenService from '../services/shared/TokenService';
import { useAppDispatch } from '../store/hooks';
import { checkTokenAndFetchUser } from '../store/slices/userSlice';
import { fetchDrugs } from '../store/slices/drugsSlice';
import { fetchDrafts } from '../store/slices/draftsSlice';
import { fetchMasterData } from '../store/slices/masterDataSlice';

const AppWrapper = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isLoginPage = location.pathname === '/login' || location.pathname === '/register';
  const isAuthenticated = !!TokenService.getToken();
  const showPublicHeader = !isAuthenticated;

  useEffect(() => {
    dispatch(checkTokenAndFetchUser());
    dispatch(fetchMasterData());
    if (isAuthenticated) {
      dispatch(fetchDrugs());
      dispatch(fetchDrafts());
    }
  }, [dispatch, isAuthenticated]);

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

      {!isLoginPage && location.pathname !== '/drug-form' && <Footer />}
    </div>
  );
};

export default AppWrapper;
