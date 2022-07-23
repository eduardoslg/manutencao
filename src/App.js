import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Routes from './routes';
import 'react-toastify/dist/ReactToastify.css'
import AuthProvider from './contexts/auth';


  function App() {


  return (
      <>
        <AuthProvider>
          <BrowserRouter>
            <Routes/>
            <ToastContainer autoClose={3000}/>
          </BrowserRouter>
        </AuthProvider>
      </>
  );
}

export default App;
