import { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const Player = () => {
  const { currentTrack, isPlaying, togglePlay, progress, duration, seek } = useContext(PlayerContext);

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(percent * duration);
  };

  return (
    <div className="player-container">
      <div className="player-left">
        {currentTrack && (
          <>
            <img src={currentTrack.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${currentTrack._id}`} alt="album art" className="now-playing-img" />
            <div className="now-playing-info">
              <span className="now-playing-title">{currentTrack.title}</span>
              <span className="now-playing-artist">{currentTrack.artist?.username || 'Unknown Artist'}</span>
            </div>
          </>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control-btn">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button className="control-play" onClick={togglePlay} disabled={!currentTrack}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" style={{marginLeft: '2px'}} />}
          </button>
          <button className="control-btn">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>
        <div className="progress-container">
          <span>{formatTime(progress)}</span>
          <div className="progress-bar" onClick={handleSeek}>
            <div 
              className="progress-fill" 
              style={{width: `${(progress / (duration || 1)) * 100}%`}}
            ></div>
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <Volume2 size={20} className="control-btn" />
        <div className="progress-bar" style={{width: '100px', cursor: 'default'}}>
          <div className="progress-fill" style={{width: '80%'}}></div>
        </div>
      </div>
    </div>
  );
};

export default Player;
