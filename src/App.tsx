


import { BrowserRouter as Router } from 'react-router-dom';
import AppWrapper from './routers/Appwrapper';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <Router>
      <UserProvider>
        <AppWrapper />
      </UserProvider>
    </Router>
  );
}

export default App;

