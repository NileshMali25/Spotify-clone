import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PlayerContext } from '../context/PlayerContext';
import { Play, Pause, Clock } from 'lucide-react';

const AlbumDetails = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack, isPlaying } = useContext(PlayerContext);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`/music/album/${id}`);
        setAlbum(res.data.album);
      } catch (err) {
        console.error("Failed to fetch album", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlbum();
  }, [id]);

  if (loading) return <div>Loading album...</div>;
  if (!album) return <div>Album not found.</div>;

  return (
    <div>
      <div style={{display: 'flex', alignItems: 'flex-end', gap: '2rem', marginBottom: '2rem'}}>
        <img 
          src={album.image || `https://api.dicebear.com/7.x/shapes/svg?seed=${album._id}`} 
          alt="album cover" 
          style={{width: '232px', height: '232px', boxShadow: '0 4px 60px rgba(0,0,0,0.5)', borderRadius: '4px', objectFit: 'cover'}}
        />
        <div>
          <span style={{fontSize: '0.875rem', fontWeight: 700}}>Album</span>
          <h1 style={{fontSize: '4rem', fontWeight: 900, margin: '0.5rem 0', letterSpacing: '-2px'}}>{album.title}</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700}}>
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${album.artist?.username}`} style={{width: '24px', height: '24px', borderRadius: '50%'}} />
            {album.artist?.username || 'Unknown'} 
            <span style={{fontWeight: 400, color: 'var(--text-secondary)'}}> • {album.musics?.length || 0} songs</span>
          </div>
        </div>
      </div>

      <div style={{marginBottom: '2rem'}}>
        <button 
          style={{
            width: '56px', height: '56px', borderRadius: '50%', 
            backgroundColor: 'var(--primary-color)', color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => {
            if (album.musics && album.musics.length > 0) {
              playTrack(album.musics[0]);
            }
          }}
        >
          <Play fill="#000" size={28} />
        </button>
      </div>

      <div style={{marginBottom: '1rem', borderBottom: '1px solid var(--divider)', paddingBottom: '0.5rem', display: 'grid', gridTemplateColumns: '16px 1fr 50px', gap: '1rem', color: 'var(--text-secondary)'}}>
        <span>#</span>
        <span>Title</span>
        <Clock size={16} />
      </div>

      <div>
        {album.musics?.map((music, index) => {
          const isCurrent = currentTrack && currentTrack._id === music._id;
          return (
            <div 
              key={music._id}
              onClick={() => playTrack(music)}
              style={{
                display: 'grid', gridTemplateColumns: '16px 1fr 50px', gap: '1rem', 
                padding: '0.75rem 0.5rem', borderRadius: '4px', cursor: 'pointer',
                backgroundColor: 'transparent', transition: 'background-color 0.2s',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-card-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span style={{color: isCurrent ? 'var(--primary-color)' : 'var(--text-secondary)'}}>
                {isCurrent && isPlaying ? <Pause size={14} fill="var(--primary-color)" /> : index + 1}
              </span>
              <span style={{color: isCurrent ? 'var(--primary-color)' : '#fff'}}>{music.title}</span>
              <span style={{color: 'var(--text-secondary)', fontSize: '0.875rem'}}>3:45</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AlbumDetails;
