import React, { useState } from 'react';
import { useSearchSongs } from '@workspace/api-client-react';
import { usePlayer } from '../context/PlayerContext';
import { Search as SearchIcon, Play, Music2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useDebounce } from '../hooks/use-debounce';

function formatDuration(sec: number) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function Search() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: results, isLoading } = useSearchSongs(
    { q: debouncedQuery },
    { query: { enabled: debouncedQuery.length > 1, queryKey: ['search', debouncedQuery] } }
  );
  const { play } = usePlayer();

  return (
    <div className="p-8 pb-32">
      <h1 className="text-4xl font-serif font-bold mb-8">Search</h1>

      <div className="relative max-w-2xl mx-auto mb-10">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          data-testid="input-search"
          type="search"
          placeholder="Artists, songs, albums..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-12 h-14 text-base rounded-full bg-card border-border focus:ring-primary"
        />
      </div>

      {!debouncedQuery && (
        <div className="text-center py-20 text-muted-foreground">
          <Music2 className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p className="text-lg">Start typing to search the catalog</p>
        </div>
      )}

      {isLoading && debouncedQuery && (
        <div className="text-center py-20 text-muted-foreground">Searching...</div>
      )}

      {results && (
        <div className="max-w-3xl mx-auto space-y-8">
          {results.songs && results.songs.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-semibold mb-4 text-primary">Songs</h2>
              <div className="space-y-1">
                {results.songs.map((song, i) => (
                  <div
                    key={song.id}
                    data-testid={`song-row-${song.id}`}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-card group cursor-pointer transition-colors"
                    onClick={() => play(song, results.songs)}
                  >
                    <span className="w-5 text-center text-muted-foreground text-sm group-hover:hidden">{i + 1}</span>
                    <Play className="w-5 h-5 text-primary hidden group-hover:block" />
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-md">
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-foreground">{song.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{song.album}</span>
                    <span className="text-sm text-muted-foreground w-12 text-right">{formatDuration(song.duration)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {results.playlists && results.playlists.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-semibold mb-4 text-primary">Playlists</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.playlists.map((pl) => (
                  <a
                    key={pl.id}
                    href={`/playlist/${pl.id}`}
                    data-testid={`card-playlist-${pl.id}`}
                    className="p-4 rounded-xl bg-card border border-border hover:bg-secondary/40 transition-colors block"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-secondary">
                      {pl.coverUrl
                        ? <img src={pl.coverUrl} alt={pl.name} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-8 h-8 text-muted-foreground" /></div>
                      }
                    </div>
                    <p className="font-medium truncate text-sm">{pl.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{pl.songCount} songs</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {results.songs?.length === 0 && results.playlists?.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No results found for &quot;{debouncedQuery}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
