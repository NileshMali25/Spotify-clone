import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext';
import { AuthContext } from '../context/AuthContext';
import { Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

const Library = () => {
  const [musics, setMusics] = useState([]);
  const { playTrack, currentTrack, isPlaying } = useContext(PlayerContext);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const res = await axios.get('/music/');
        // Filter songs so it only shows songs uploaded by the logged-in user
        const userSongs = res.data.musics.filter(m => m.artist?._id === user?.id || m.artist?.username === user?.username);
        setMusics(userSongs);
      } catch (err) {
        console.error("Failed to fetch library", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMusics();
  }, [user]);

  if (loading) return <div>Loading your library...</div>;

  return (
    <div>
      <h1 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '2rem'}}>Your Library</h1>
      
      {musics.length === 0 ? (
        <div style={{color: 'var(--text-secondary)'}}>
          You haven't uploaded any songs yet. 
          {user?.role === 'artist' ? ' Head to the Upload page to add some music!' : ''}
        </div>
      ) : (
        <div className="card-grid">
          {musics.map(music => {
            const isCurrent = currentTrack && currentTrack._id === music._id;
            return (
              <div className="card" key={music._id} onClick={() => playTrack(music)}>
                <img 
                  src={music.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${music._id}`} 
                  alt="music" 
                  className="card-img" 
                />
                <div className="card-title" style={{color: isCurrent ? 'var(--primary-color)' : 'white'}}>
                  {music.title}
                </div>
                <div className="card-subtitle">{music.artist?.username || 'Unknown Artist'}</div>
                <button className="play-button" onClick={(e) => {
                  e.stopPropagation();
                  playTrack(music);
                }}>
                  {isCurrent && isPlaying ? <Pause fill="#000" size={24} /> : <Play fill="#000" size={24} />}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Library;
