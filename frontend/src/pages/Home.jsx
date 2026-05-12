import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext';
import { Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [albums, setAlbums] = useState([]);
  const [musics, setMusics] = useState([]);
  const { playTrack, currentTrack, isPlaying } = useContext(PlayerContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [albumRes, musicRes] = await Promise.all([
          axios.get('/music/album'),
          axios.get('/music/')
        ]);
        setAlbums(albumRes.data.albums);
        setMusics(musicRes.data.musics);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading awesome vibes...</div>;

  return (
    <div>
      <h2 className="section-title">Popular Albums</h2>
      <div className="card-grid">
        {albums.map(album => (
          <Link to={`/album/${album._id}`} key={album._id}>
            <div className="card">
              <img 
                src={album.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${album._id}`} 
                alt="album" 
                className="card-img" 
              />
              <div className="card-title">{album.title}</div>
              <div className="card-subtitle">{album.artist?.username || 'Unknown Artist'}</div>
              <button className="play-button" onClick={(e) => e.preventDefault()}>
                <Play fill="#000" size={24} />
              </button>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="section-title">Fresh Tracks</h2>
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
    </div>
  );
};

export default Home;
