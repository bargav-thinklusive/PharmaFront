import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppWrapper from './routers/Appwrapper';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Router>
      <Provider store={store}>
        <AppWrapper />
        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 99999 }}
        />
      </Provider>
    </Router>
  );
}

export default App;

