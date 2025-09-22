import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Header from '../pages/Header';
import Login from '../components/LoginPage';
import Home from '../pages/Home';
import About from '../pages/About';
import Docs from '../pages/Docs';
import Contacts from '../pages/Contacts';
import ResultList from '../components/Results/ResultList';
import CompoundDetailsPage from '../components/CompoundDetails/CompoundDetailsPage';
import Body from '../pages/Body';
import Footer from '../pages/Footer';
import NotFound from '../pages/NotFound';

const AppWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header isLoginPage={isLoginPage} />
      
      <Body>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path=":ccategory/:searchtext" element={<ResultList />} />
          <Route path=":ccategory/:searchtext/:cid" element={<CompoundDetailsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Body>
      
      {!isLoginPage && <Footer />}
    </div>
  );
};

export default AppWrapper;