import './App.css';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Favourites from './pages/Favourites';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';


function App() {
    const userId = Cookies.get("userId");
  return (
    <div className='flex'>
      <Sidebar  />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/favourites" element={userId ? <Favourites /> : <Navigate to="/" />}/>
        </Routes>
      </div>
    </div>
  );
}

export default App;
