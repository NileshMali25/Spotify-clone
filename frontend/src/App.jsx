import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AlbumDetails from './pages/AlbumDetails';
import Upload from './pages/Upload';
import CreateAlbum from './pages/CreateAlbum';
import Search from './pages/Search';
import Library from './pages/Library';
import Sidebar from './components/Sidebar';
import Player from './components/Player';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Loading...</div>;

  return (
    <>
      {!user ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <>
          <div className="app-container">
            <Sidebar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/library" element={<Library />} />
                <Route path="/album/:id" element={<AlbumDetails />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/create-album" element={<CreateAlbum />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>
          <Player />
        </>
      )}
    </>
  );
}

export default App;
