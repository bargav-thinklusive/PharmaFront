
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Body from './components/Body';
import Footer from './components/Footer';


import Home from './pages/Home';
import About from './pages/About';
import Submit from './pages/Submit';
import Docs from './pages/Docs';
import Contacts from './pages/Contacts';
import ResultList from './pages/results/ResultList';
import CompoundDetailsPage from './pages/CompoundDetailsPage';



function App() {
  return (
    <Router>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <Body>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path=":ccategory/:searchtext" element={<ResultList />} />
            <Route path=":ccategory/:searchtext/:cid" element={<CompoundDetailsPage />} />
          </Routes>
        </Body>
        <Footer />
      </div>
    </Router>
  );
}

export default App
