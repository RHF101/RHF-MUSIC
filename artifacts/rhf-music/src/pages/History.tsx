import React from 'react';
import { Link } from 'wouter';
import { useGetHistory, getGetHistoryQueryKey } from '@workspace/api-client-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../hooks/use-auth';
import { Play, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

function timeAgo(dateStr: string) {
  const date = new Date(dateStr);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDuration(sec: number) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function History() {
  const { user } = useAuth();
  const { currentSong, play } = usePlayer();

  const userId = user?.id ?? '';
  const { data: history, isLoading } = useGetHistory(
    { userId, limit: 50 },
    { query: { enabled: !!user?.id, queryKey: getGetHistoryQueryKey({ userId, limit: 50 }) } }
  );

  if (!user) {
    return (
      <div className="p-8 text-center py-24">
        <Clock className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary" />
        <p className="text-muted-foreground text-lg mb-4">Log in to see your listening history</p>
        <Link href="/auth/login">
          <Button className="bg-primary text-primary-foreground">Log In</Button>
        </Link>
      </div>
    );
  }

  const songs = (history || []).map((h: any) => h.song);

  return (
    <div className="p-8 pb-32">
      <h1 className="text-4xl font-serif font-bold mb-2">Recently Played</h1>
      <p className="text-muted-foreground mb-8">Your listening history</p>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      {!isLoading && (!history || history.length === 0) && (
        <div className="text-center py-20">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-20 text-primary" />
          <p className="text-muted-foreground">No listening history yet. Start playing some music!</p>
        </div>
      )}

      {history && history.length > 0 && (
        <div className="space-y-1">
          {history.map((entry: any, i: number) => {
            const song = entry.song;
            if (!song) return null;
            const isCurrent = currentSong?.id === song.id;
            return (
              <div
                key={`${entry.id}-${i}`}
                data-testid={`history-row-${entry.id}`}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-colors ${isCurrent ? 'bg-primary/10' : 'hover:bg-card'}`}
                onClick={() => play(song, songs)}
              >
                <span className={`w-5 text-center text-sm group-hover:hidden ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground'}`}>{i + 1}</span>
                <Play className="w-5 h-5 text-primary hidden group-hover:block shrink-0" />
                <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate text-sm ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{song.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                <span className="text-sm text-muted-foreground hidden md:block">{song.album}</span>
                <span className="text-sm text-muted-foreground w-16 text-right">{formatDuration(song.duration)}</span>
                <span className="text-xs text-muted-foreground w-20 text-right">{timeAgo(entry.playedAt)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
