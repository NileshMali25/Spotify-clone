import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { DiscAlbum } from 'lucide-react';

const CreateAlbum = () => {
  const [title, setTitle] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [availableSongs, setAvailableSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('/music/');
        // Only allow artists to add their own songs to their album
        const mySongs = res.data.musics.filter(m => m.artist?._id === user?.id || m.artist?.username === user?.username);
        setAvailableSongs(mySongs);
      } catch (err) {
        console.error('Failed to fetch songs for album', err);
      }
    };
    if (user?.role === 'artist') fetchSongs();
  }, [user]);

  if (user?.role !== 'artist') {
    return <div style={{padding: '2rem'}}>You must be an artist to create an album.</div>;
  }

  const toggleSong = (songId) => {
    setSelectedSongs(prev => 
      prev.includes(songId) ? prev.filter(id => id !== songId) : [...prev, songId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedSongs.length === 0) {
      setError('Please select at least one song for the album.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('musics', JSON.stringify(selectedSongs));
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.post('/music/album', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Album created successfully!');
      setTitle('');
      setImageFile(null);
      setSelectedSongs([]);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create album');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: '800px', margin: '0 auto', paddingTop: '2rem', paddingBottom: '100px'}}>
      <h1 className="section-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <DiscAlbum /> Create New Album
      </h1>
      
      <div className="card" style={{padding: '2rem', cursor: 'default'}}>
        {error && <div style={{color: '#ff4444', marginBottom: '1rem'}}>{error}</div>}
        {success && <div style={{color: 'var(--primary-color)', marginBottom: '1rem'}}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Album Title</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="e.g. Greatest Hits" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Album Cover (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{color: 'var(--text-primary)'}}
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Select Songs ({selectedSongs.length} selected)</label>
            {availableSongs.length === 0 ? (
              <div style={{color: 'var(--text-secondary)'}}>You have not uploaded any songs yet. Upload songs first!</div>
            ) : (
              <div style={{display: 'grid', gap: '0.5rem', maxHeight: '300px', overflowY: 'auto', paddingRight: '0.5rem'}}>
                {availableSongs.map(song => (
                  <div 
                    key={song._id} 
                    onClick={() => toggleSong(song._id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', 
                      backgroundColor: selectedSongs.includes(song._id) ? 'var(--primary-color)' : '#2a2a2a',
                      color: selectedSongs.includes(song._id) ? '#000' : '#fff',
                      borderRadius: '4px', cursor: 'pointer', transition: 'background-color 0.2s'
                    }}
                  >
                    <img src={song.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${song._id}`} style={{width: '40px', height: '40px', borderRadius: '4px'}} />
                    <div style={{fontWeight: '600'}}>{song.title}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading || availableSongs.length === 0}
            style={{marginTop: '1rem', opacity: (loading || availableSongs.length === 0) ? 0.7 : 1}}
          >
            {loading ? 'CREATING...' : 'CREATE ALBUM'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAlbum;
