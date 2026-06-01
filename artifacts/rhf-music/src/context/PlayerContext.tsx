import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { Song } from '@workspace/api-client-react';
import { useAuth } from '../hooks/use-auth';
import { useRecordPlay } from '@workspace/api-client-react';

type PlayerState = {
  currentSong: Song | null;
  queue: Song[];
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
  audioRef: React.RefObject<HTMLAudioElement | null>;
  play: (song: Song, queue?: Song[]) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  addToQueue: (song: Song) => void;
  removeFromQueue: (index: number) => void;
  setQueue: (queue: Song[]) => void;
};

const PlayerContext = createContext<PlayerState | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueueState] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'one' | 'all'>('off');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordPlayMutation = useRecordPlay();
  const { user } = useAuth();
  
  const recordPlayFnRef = useRef(recordPlayMutation.mutate);
  recordPlayFnRef.current = recordPlayMutation.mutate;

  const updateMediaSession = useCallback((song: Song) => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: song.title,
        artist: song.artist,
        album: song.album || 'Unknown Album',
        artwork: [
          { src: song.coverUrl, sizes: '512x512', type: 'image/jpeg' }
        ]
      });
    }
  }, []);

  const play = useCallback((song: Song, newQueue?: Song[]) => {
    setCurrentSong(song);
    if (newQueue) {
      setQueueState(newQueue);
    }
    setIsPlaying(true);
    updateMediaSession(song);
    
    if (user && recordPlayFnRef.current) {
        recordPlayFnRef.current({ data: { songId: song.id, userId: user.id } });
    }
  }, [user, updateMediaSession]);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resume = useCallback(() => {
    if (currentSong) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  }, [currentSong]);

  const next = useCallback(() => {
    if (!currentSong) return;
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex >= 0 && currentIndex < queue.length - 1) {
      play(queue[currentIndex + 1]);
    } else if (repeat === 'all' && queue.length > 0) {
      play(queue[0]);
    } else {
      setIsPlaying(false);
    }
  }, [currentSong, queue, repeat, play]);

  const prev = useCallback(() => {
    if (!currentSong) return;
    if (currentTime > 3) {
      seekTo(0);
      return;
    }
    const currentIndex = queue.findIndex(s => s.id === currentSong.id);
    if (currentIndex > 0) {
      play(queue[currentIndex - 1]);
    } else if (repeat === 'all' && queue.length > 0) {
      play(queue[queue.length - 1]);
    }
  }, [currentSong, queue, repeat, play, currentTime]);

  const seekTo = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  }, []);

  const toggleShuffle = useCallback(() => setShuffle(prev => !prev), []);
  
  const toggleRepeat = useCallback(() => {
    setRepeat(prev => {
      if (prev === 'off') return 'all';
      if (prev === 'all') return 'one';
      return 'off';
    });
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueueState(prev => [...prev, song]);
  }, []);

  const removeFromQueue = useCallback((index: number) => {
    setQueueState(prev => {
      const newQ = [...prev];
      newQ.splice(index, 1);
      return newQ;
    });
  }, []);

  const setQueue = useCallback((newQueue: Song[]) => {
      setQueueState(newQueue);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play().catch(console.error);
      } else {
        next();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying && currentSong) {
      audio.src = currentSong.audioUrl;
      audio.play().catch(console.error);
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSong, isPlaying, next, repeat]);

  useEffect(() => {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', resume);
      navigator.mediaSession.setActionHandler('pause', pause);
      navigator.mediaSession.setActionHandler('previoustrack', prev);
      navigator.mediaSession.setActionHandler('nexttrack', next);
    }
  }, [resume, pause, prev, next]);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        currentTime,
        duration,
        volume,
        shuffle,
        repeat,
        audioRef,
        play,
        pause,
        resume,
        next,
        prev,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        setQueue
      }}
    >
      {children}
      <audio ref={audioRef} style={{ display: 'none' }} />
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
};
