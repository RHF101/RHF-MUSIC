import React from 'react';
import { Link } from 'wouter';
import { useGetLikedSongs, getGetLikedSongsQueryKey, useUnlikeSong } from '@workspace/api-client-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { Play, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDuration(sec: number) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function LikedSongs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { currentSong, isPlaying, play, pause } = usePlayer();

  const userId = user?.id ?? '';
  const { data: songs, isLoading } = useGetLikedSongs(
    { userId },
    { query: { enabled: !!user?.id, queryKey: getGetLikedSongsQueryKey({ userId }) } }
  );

  const unlike = useUnlikeSong({
    mutation: {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetLikedSongsQueryKey({ userId }) }),
    },
  });

  if (!user) {
    return (
      <div className="p-8 text-center py-24">
        <Heart className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary" />
        <p className="text-muted-foreground text-lg mb-4">Log in to see your liked songs</p>
        <Link href="/auth/login">
          <Button className="bg-primary text-primary-foreground">Log In</Button>
        </Link>
      </div>
    );
  }

  const list = songs || [];

  return (
    <div className="pb-32">
      <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-primary/10 to-background">
        <div className="flex items-end gap-6">
          <div className="w-44 h-44 rounded-xl bg-gradient-to-br from-primary/60 to-primary/20 flex items-center justify-center shadow-2xl">
            <Heart className="w-20 h-20 text-primary fill-current" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Playlist</p>
            <h1 className="text-4xl font-serif font-bold mb-1">Liked Songs</h1>
            <p className="text-sm text-muted-foreground">{list.length} songs</p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <Button
            data-testid="button-play-liked"
            onClick={() => list.length > 0 && play(list[0], list)}
            disabled={list.length === 0}
            className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          >
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </Button>
        </div>
      </div>

      <div className="px-8">
        {isLoading && <div className="text-muted-foreground py-8">Loading...</div>}

        {!isLoading && list.length === 0 && (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 mx-auto mb-3 opacity-20 text-primary" />
            <p className="text-muted-foreground">No liked songs yet. Heart a song to add it here.</p>
          </div>
        )}

        {list.length > 0 && (
          <div className="space-y-1">
            <div className="grid grid-cols-[32px_1fr_1fr_80px_40px] gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border mb-2">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /></span>
              <span></span>
            </div>
            {list.map((song: any, i: number) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  data-testid={`song-liked-${song.id}`}
                  className={`grid grid-cols-[32px_1fr_1fr_80px_40px] gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-colors ${isCurrent ? 'bg-primary/10' : 'hover:bg-card'}`}
                  onClick={() => play(song, list)}
                >
                  <span className={`text-sm self-center ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{i + 1}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium truncate text-sm ${isCurrent ? 'text-primary' : ''}`}>{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground self-center truncate">{song.album}</span>
                  <span className="text-sm text-muted-foreground self-center">{formatDuration(song.duration)}</span>
                  <button
                    data-testid={`button-unlike-${song.id}`}
                    className="self-center text-primary hover:text-muted-foreground transition-colors"
                    onClick={(e) => { e.stopPropagation(); unlike.mutate({ userId: user.id, songId: song.id }); }}
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
