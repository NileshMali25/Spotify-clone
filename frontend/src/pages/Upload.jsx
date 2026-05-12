import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UploadCloud } from 'lucide-react';

const Upload = () => {
  const [title, setTitle] = useState('');
  const [musicFile, setMusicFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (user?.role !== 'artist') {
    return <div style={{padding: '2rem'}}>You must be an artist to upload music.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', title);
    if (musicFile) formData.append('music', musicFile);
    if (imageFile) formData.append('image', imageFile);

    try {
      await axios.post('/music/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSuccess('Song uploaded successfully!');
      setTitle('');
      setMusicFile(null);
      setImageFile(null);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload song');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: '600px', margin: '0 auto', paddingTop: '2rem'}}>
      <h1 className="section-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <UploadCloud /> Upload New Song
      </h1>
      
      <div className="card" style={{padding: '2rem', cursor: 'default'}}>
        {error && <div style={{color: '#ff4444', marginBottom: '1rem'}}>{error}</div>}
        {success && <div style={{color: 'var(--primary-color)', marginBottom: '1rem'}}>{success}</div>}
        
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Song Title</label>
            <input 
              type="text" 
              className="auth-input" 
              placeholder="e.g. Bohemian Rhapsody" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required 
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Audio File (.mp3, .wav)</label>
            <input 
              type="file" 
              accept="audio/*"
              onChange={(e) => setMusicFile(e.target.files[0])}
              required 
              style={{color: 'var(--text-primary)'}}
            />
          </div>

          <div>
            <label style={{display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)'}}>Cover Image (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              style={{color: 'var(--text-primary)'}}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button" 
            disabled={loading}
            style={{marginTop: '1rem', opacity: loading ? 0.7 : 1}}
          >
            {loading ? 'UPLOADING...' : 'UPLOAD SONG'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Upload;
