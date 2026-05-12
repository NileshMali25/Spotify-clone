import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Home, Search, Library, Music, LogOut, UploadCloud, DiscAlbum } from 'lucide-react';

const Sidebar = () => {
  const { logout, user } = useContext(AuthContext);

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <Music color="#1DB954" size={32} />
        Vibe
      </div>
      
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/" className={({isActive}) => isActive ? 'active' : ''}>
            <Home size={24} /> Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/search" className={({isActive}) => isActive ? 'active' : ''}>
            <Search size={24} /> Search
          </NavLink>
        </li>
        <li>
          <NavLink to="/library" className={({isActive}) => isActive ? 'active' : ''}>
            <Library size={24} /> Your Library
          </NavLink>
        </li>
        {user?.role === 'artist' && (
          <>
            <li>
              <NavLink to="/upload" className={({isActive}) => isActive ? 'active' : ''}>
                <UploadCloud size={24} /> Upload Song
              </NavLink>
            </li>
            <li>
              <NavLink to="/create-album" className={({isActive}) => isActive ? 'active' : ''}>
                <DiscAlbum size={24} /> Create Album
              </NavLink>
            </li>
          </>
        )}
      </ul>

      <div style={{marginTop: 'auto'}}>
        <div style={{padding: '0 1rem', marginBottom: '1rem', color: '#B3B3B3', fontSize: '0.875rem'}}>
          Logged in as <b>{user?.username}</b>
          <br/>
          <span style={{fontSize: '0.75rem'}}>{user?.role}</span>
        </div>
        <ul className="sidebar-nav">
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
              <LogOut size={24} /> Logout
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
