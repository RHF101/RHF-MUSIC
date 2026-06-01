import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Play, Pause, SkipBack, SkipForward, Repeat, Repeat1, Shuffle, Volume2, VolumeX, ListMusic, Mic2 } from 'lucide-react';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export const PlayerBar: React.FC<{
  onToggleRightPanel: (panel: 'queue' | 'lyrics' | null) => void;
  activeRightPanel: 'queue' | 'lyrics' | null;
}> = ({ onToggleRightPanel, activeRightPanel }) => {
  const {
    currentSong, isPlaying, currentTime, duration, volume, shuffle, repeat,
    audioRef, play, pause, resume, next, prev, seekTo, setVolume, toggleShuffle, toggleRepeat
  } = usePlayer();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!audioRef?.current) return;
    
    const setupAudioContext = () => {
      if (!audioContextRef.current) {
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
             audioContextRef.current = new AudioContext();
             analyserRef.current = audioContextRef.current.createAnalyser();
             analyserRef.current.fftSize = 256;
             
             sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current!);
             sourceRef.current.connect(analyserRef.current);
             analyserRef.current.connect(audioContextRef.current.destination);
          }
        } catch (e) {
          console.log('AudioContext creation failed', e);
        }
      } else if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    const handlePlay = () => {
      setupAudioContext();
    };

    audioRef.current.addEventListener('play', handlePlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('play', handlePlay);
      }
    };
  }, [audioRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);
      
      if (!analyserRef.current || !isPlaying) {
         return;
      }
      
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height;
        
        ctx.fillStyle = `rgba(201, 169, 110, ${0.1 + (barHeight / height) * 0.3})`;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!currentSong) {
    return (
      <div className="h-[90px] bg-card border-t border-border fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center text-muted-foreground text-sm">
        Select a song to start listening
      </div>
    );
  }

  return (
    <div className="h-[90px] bg-card/95 backdrop-blur-md border-t border-border fixed bottom-0 left-0 right-0 z-50 px-4 flex items-center justify-between shadow-2xl relative overflow-hidden">
      <canvas 
        ref={canvasRef} 
        width={1000} 
        height={90} 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-50 z-0" 
      />
      
      {/* Left: Song Info */}
      <div className="flex items-center w-[30%] min-w-[200px] z-10">
        <div className="w-14 h-14 rounded-md overflow-hidden mr-4 shrink-0 shadow-md">
          <img src={currentSong.coverUrl} alt={currentSong.title} className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col truncate">
          <span className="text-sm font-semibold truncate text-foreground">{currentSong.title}</span>
          <span className="text-xs text-muted-foreground truncate hover:underline cursor-pointer">{currentSong.artist}</span>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center max-w-[40%] w-full z-10">
        <div className="flex items-center space-x-6 mb-2">
          <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-foreground h-8 w-8", shuffle && "text-primary hover:text-primary")} onClick={toggleShuffle}>
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary h-8 w-8" onClick={prev}>
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          <Button 
            variant="default" 
            size="icon" 
            className="rounded-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground hover:scale-105 transition-transform h-10 w-10 flex items-center justify-center shadow-lg" 
            onClick={isPlaying ? pause : resume}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-foreground hover:text-primary h-8 w-8" onClick={next}>
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className={cn("text-muted-foreground hover:text-foreground h-8 w-8", repeat !== 'off' && "text-primary hover:text-primary")} onClick={toggleRepeat}>
            {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
          </Button>
        </div>
        <div className="flex items-center w-full space-x-3 text-xs text-muted-foreground font-medium">
          <span className="w-10 text-right">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={0.1}
            onValueChange={(val) => seekTo(val[0])}
            className="flex-1 cursor-pointer"
          />
          <span className="w-10 text-left">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Right: Extra Controls */}
      <div className="flex items-center justify-end w-[30%] min-w-[200px] space-x-4 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", activeRightPanel === 'lyrics' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
          onClick={() => onToggleRightPanel(activeRightPanel === 'lyrics' ? null : 'lyrics')}
        >
          <Mic2 className="w-4 h-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("h-8 w-8", activeRightPanel === 'queue' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
          onClick={() => onToggleRightPanel(activeRightPanel === 'queue' ? null : 'queue')}
        >
          <ListMusic className="w-4 h-4" />
        </Button>
        <div className="flex items-center space-x-2 w-28 group">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0" onClick={() => setVolume(volume === 0 ? 1 : 0)}>
            {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(val) => setVolume(val[0] / 100)}
            className="cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
