import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { demoLyrics } from '../data/lyrics';
import { motion, AnimatePresence } from 'framer-motion';

export const RightPanel: React.FC<{ panel: 'queue' | 'lyrics' | null }> = ({ panel }) => {
  const { currentSong, queue, play, removeFromQueue, currentTime } = usePlayer();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (panel === 'lyrics' && scrollRef.current) {
      const activeLineIndex = demoLyrics.findLastIndex(l => currentTime >= l.time);
      if (activeLineIndex >= 0) {
        const lineElements = scrollRef.current.children;
        if (lineElements[activeLineIndex]) {
          lineElements[activeLineIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    }
  }, [currentTime, panel]);

  if (!panel) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 300, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-[300px] h-full bg-card border-l border-border fixed right-0 top-0 bottom-[90px] z-40 flex flex-col shadow-xl"
      >
        <div className="p-4 border-b border-border bg-card/80 backdrop-blur z-10 font-serif font-bold text-lg tracking-wide sticky top-0">
          {panel === 'queue' ? 'Playing Next' : 'Lyrics'}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative" ref={scrollRef}>
          {panel === 'queue' && (
            <div className="space-y-4 pb-20">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Now Playing</h3>
                {currentSong ? (
                  <div className="flex items-center space-x-3 p-2 rounded-md bg-secondary/50">
                    <img src={currentSong.coverUrl} alt="" className="w-12 h-12 rounded shadow-sm object-cover" />
                    <div className="flex flex-col truncate">
                      <span className="text-sm font-medium text-primary truncate">{currentSong.title}</span>
                      <span className="text-xs text-muted-foreground truncate">{currentSong.artist}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Nothing playing</p>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Next in Queue</h3>
                {queue.length > 0 ? (
                  <div className="space-y-2">
                    {queue.map((song, i) => (
                      <div key={`${song.id}-${i}`} className="group flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 transition-colors">
                        <div className="flex items-center space-x-3 truncate cursor-pointer" onClick={() => play(song)}>
                           <img src={song.coverUrl} alt="" className="w-10 h-10 rounded shadow-sm object-cover" />
                           <div className="flex flex-col truncate max-w-[150px]">
                             <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{song.title}</span>
                             <span className="text-xs text-muted-foreground truncate">{song.artist}</span>
                           </div>
                        </div>
                        <button 
                          className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity text-xs p-1"
                          onClick={(e) => { e.stopPropagation(); removeFromQueue(i); }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Queue is empty</p>
                )}
              </div>
            </div>
          )}

          {panel === 'lyrics' && (
            <div className="space-y-6 pb-32 pt-8 px-2 text-center font-serif text-xl">
              {demoLyrics.map((line, i) => {
                const isActive = currentTime >= line.time && (i === demoLyrics.length - 1 || currentTime < demoLyrics[i + 1].time);
                const isPassed = currentTime >= line.time;
                
                return (
                  <div 
                    key={i} 
                    className={`transition-all duration-300 ease-in-out cursor-pointer hover:opacity-100 ${
                      isActive ? 'text-primary scale-105 font-bold opacity-100 drop-shadow-[0_0_8px_rgba(201,169,110,0.3)]' : 
                      isPassed ? 'text-muted-foreground opacity-60' : 'text-muted-foreground/40 opacity-40'
                    }`}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Shadow overlay at bottom to fade text out */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent pointer-events-none" />
      </motion.div>
    </AnimatePresence>
  );
};
