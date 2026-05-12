import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext';
import { Play, Pause, Search as SearchIcon } from 'lucide-react';

const Search = () => {
  const [musics, setMusics] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { playTrack, currentTrack, isPlaying } = useContext(PlayerContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const res = await axios.get('/music/');
        setMusics(res.data.musics);
      } catch (err) {
        console.error("Failed to fetch music", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMusics();
  }, []);

  const filteredMusics = musics.filter(music => 
    music.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (music.artist?.username || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div style={{position: 'relative', marginBottom: '2rem'}}>
        <SearchIcon color="#000" style={{position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)'}} />
        <input 
          type="text" 
          placeholder="What do you want to listen to?" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%', maxWidth: '400px', padding: '14px 14px 14px 48px',
            borderRadius: '50px', border: 'none', outline: 'none',
            fontSize: '1rem', fontWeight: '500'
          }}
        />
      </div>

      <h2 className="section-title">Browse all</h2>
      
      {loading ? (
        <div>Loading awesome vibes...</div>
      ) : filteredMusics.length === 0 ? (
        <div style={{color: 'var(--text-secondary)'}}>No songs found matching "{searchTerm}"</div>
      ) : (
        <div className="card-grid">
          {filteredMusics.map(music => {
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

export default Search;
