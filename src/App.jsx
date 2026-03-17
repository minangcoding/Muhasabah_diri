import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Capsule from './pages/Capsule';
import Admin from './pages/Admin'; // 1. Tambahkan impor ini!

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        {/* PASTIKAN HANYA SATU ROUTE CAPSULE SEPERTI DI BAWAH INI */}
        <Route path="/capsule" element={<Capsule />} /> 
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;