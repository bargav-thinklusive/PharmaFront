import { Routes, Route, useLocation } from 'react-router-dom';
import Header from '../../pages/Header';
import Login from '../LoginPage';
import Home from '../../pages/Home';
import About from '../../pages/About';
import Submit from '../../pages/Submit';
import Docs from '../../pages/Docs';
import Contacts from '../../pages/Contacts';
import ResultList from '../Results/ResultList';
import CompoundDetailsPage from '../CompoundDetails/CompoundDetailsPage';
import Body from '../../pages/Body';
import Footer from '../../pages/Footer';
import NotFound from '../../pages/NotFound';

const AppWrapper = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header isLoginPage={isLoginPage} />

      {/* main content grows to push footer down */}
      
        <Body>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<Submit />} />
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
