import './App.css';
import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { UserContextProvider } from './UserContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';

function App() {

  return (
    <UserContextProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/' element={<AdminPage />}/>
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;