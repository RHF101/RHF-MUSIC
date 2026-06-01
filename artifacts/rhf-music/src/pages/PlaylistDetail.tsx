import React, { useState } from 'react';
import { useParams } from 'wouter';
import {
  useGetPlaylist, getGetPlaylistQueryKey,
  useGetLikedSongs, getGetLikedSongsQueryKey,
  useLikeSong, useUnlikeSong,
  useAddSongToPlaylist, useRemoveSongFromPlaylist,
} from '@workspace/api-client-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { Play, Pause, Heart, Trash2, Clock, Music2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function formatDuration(sec: number) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function totalDuration(songs: any[]) {
  const total = songs.reduce((acc, s) => acc + (s.duration || 0), 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m} min`;
}

export default function PlaylistDetail() {
  const { id } = useParams<{ id: string }>();
  const playlistId = Number(id);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { currentSong, isPlaying, play, pause, resume } = usePlayer();

  const { data: playlist, isLoading } = useGetPlaylist(playlistId, {
    query: { queryKey: getGetPlaylistQueryKey(playlistId) },
  });
  const userId = user?.id ?? '';
  const { data: likedSongs } = useGetLikedSongs(
    { userId },
    { query: { enabled: !!user?.id, queryKey: getGetLikedSongsQueryKey({ userId }) } }
  );

  const likeMutation = useLikeSong({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetLikedSongsQueryKey({ userId }) }) }
  });
  const unlikeMutation = useUnlikeSong({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetLikedSongsQueryKey({ userId }) }) }
  });
  const removeSong = useRemoveSongFromPlaylist({
    mutation: { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetPlaylistQueryKey(playlistId) }) }
  });

  const likedIds = new Set((likedSongs || []).map((s: any) => s.id));
  const songs = playlist?.songs || [];
  const isPlaylistPlaying = isPlaying && songs.some((s: any) => s.id === currentSong?.id);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    if (isPlaylistPlaying) {
      pause();
    } else if (songs.some((s: any) => s.id === currentSong?.id)) {
      resume();
    } else {
      play(songs[0], songs);
    }
  };

  const handleLike = (song: any) => {
    if (!user) return;
    if (likedIds.has(song.id)) {
      unlikeMutation.mutate({ userId: user.id, songId: song.id });
    } else {
      likeMutation.mutate({ data: { userId: user.id, songId: song.id } });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading playlist...</div>;
  }

  if (!playlist) {
    return <div className="p-8 text-muted-foreground">Playlist not found.</div>;
  }

  return (
    <div className="pb-32">
      {/* Header */}
      <div className="relative">
        <div
          className="h-64 bg-gradient-to-b from-primary/20 to-background relative overflow-hidden"
          style={playlist.coverUrl ? {
            backgroundImage: `url(${playlist.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          } : {}}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-background" />
        </div>
        <div className="absolute bottom-0 left-8 pb-6 flex items-end gap-6">
          <div className="w-44 h-44 rounded-xl overflow-hidden shadow-2xl shrink-0 bg-secondary">
            {playlist.coverUrl
              ? <img src={playlist.coverUrl} alt={playlist.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-16 h-16 text-muted-foreground" /></div>
            }
          </div>
          <div className="mb-2">
            <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-1">Playlist</p>
            <h1 className="text-4xl font-serif font-bold text-white drop-shadow-lg mb-1">{playlist.name}</h1>
            {playlist.description && <p className="text-sm text-gray-300 mb-2">{playlist.description}</p>}
            <p className="text-sm text-gray-400">{songs.length} songs · {totalDuration(songs)}</p>
          </div>
        </div>
      </div>

      <div className="p-8 pt-6">
        <div className="flex items-center gap-4 mb-8">
          <Button
            data-testid="button-play-playlist"
            onClick={handlePlayAll}
            disabled={songs.length === 0}
            className="rounded-full w-14 h-14 p-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          >
            {isPlaylistPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
          </Button>
        </div>

        {songs.length === 0 ? (
          <div className="text-center py-16">
            <Music2 className="w-12 h-12 mx-auto mb-3 opacity-20 text-primary" />
            <p className="text-muted-foreground">No songs in this playlist yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-[32px_1fr_1fr_80px_40px_40px] gap-4 px-4 py-2 text-xs text-muted-foreground uppercase tracking-wider border-b border-border mb-2">
              <span>#</span>
              <span>Title</span>
              <span>Album</span>
              <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /></span>
              <span></span>
              <span></span>
            </div>
            {songs.map((song: any, i: number) => {
              const isCurrent = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  data-testid={`song-row-${song.id}`}
                  className={`grid grid-cols-[32px_1fr_1fr_80px_40px_40px] gap-4 px-4 py-3 rounded-xl group cursor-pointer transition-colors ${isCurrent ? 'bg-primary/10' : 'hover:bg-card'}`}
                  onClick={() => play(song, songs)}
                >
                  <span className={`text-sm self-center ${isCurrent ? 'text-primary font-bold' : 'text-muted-foreground group-hover:hidden'}`}>{i + 1}</span>
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-md overflow-hidden shrink-0">
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium truncate text-sm ${isCurrent ? 'text-primary' : 'text-foreground'}`}>{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground self-center truncate">{song.album}</span>
                  <span className="text-sm text-muted-foreground self-center">{formatDuration(song.duration)}</span>
                  <button
                    data-testid={`button-like-${song.id}`}
                    className={`self-center opacity-0 group-hover:opacity-100 transition-opacity ${likedIds.has(song.id) ? 'opacity-100 text-primary' : 'text-muted-foreground hover:text-primary'}`}
                    onClick={(e) => { e.stopPropagation(); handleLike(song); }}
                  >
                    <Heart className={`w-4 h-4 ${likedIds.has(song.id) ? 'fill-current' : ''}`} />
                  </button>
                  {user && (
                    <button
                      data-testid={`button-remove-${song.id}`}
                      className="self-center opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); removeSong.mutate({ id: playlistId, songId: song.id }); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
