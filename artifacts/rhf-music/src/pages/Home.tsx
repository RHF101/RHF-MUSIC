import React from 'react';
import { useGetFeaturedSongs, useGetSongs, useGetAiRecommendations } from '@workspace/api-client-react';
import { usePlayer } from '../context/PlayerContext';
import { useAuth } from '../hooks/use-auth';
import { Play } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const { data: featuredSongs, isLoading: loadingFeatured } = useGetFeaturedSongs();
  const { data: songs, isLoading: loadingSongs } = useGetSongs({ limit: 12 });
  const { data: recs, isLoading: loadingRecs } = useGetAiRecommendations(
    { userId: user?.id || '' },
    { query: { enabled: !!user?.id, queryKey: ['ai-recommendations', user?.id] } }
  );
  
  const { play } = usePlayer();

  if (loadingFeatured || loadingSongs) {
    return <div className="p-8 text-muted-foreground flex items-center justify-center h-full">Loading...</div>;
  }

  return (
    <div className="p-8 pb-32">
      <h1 className="text-4xl font-serif font-bold text-foreground mb-8 tracking-wide">Featured <span className="text-primary italic">Selection</span></h1>
      
      {/* Featured Header */}
      {featuredSongs && featuredSongs.length > 0 && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden mb-12 group cursor-pointer" onClick={() => play(featuredSongs[0], featuredSongs)}>
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10" />
          <img 
            src={featuredSongs[0].coverUrl} 
            alt={featuredSongs[0].title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute bottom-8 left-8 z-20 max-w-2xl">
            <div className="text-primary text-sm font-semibold tracking-widest uppercase mb-2">Trendsetter</div>
            <h2 className="text-5xl font-bold font-serif text-white mb-2">{featuredSongs[0].title}</h2>
            <p className="text-xl text-gray-300 mb-6">{featuredSongs[0].artist}</p>
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 pl-5 shadow-lg hover:scale-105 transition-transform">
              <Play className="w-6 h-6 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* Recommended for you */}
      {user && recs && recs.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-border pb-2">Recommended for You</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {recs.map((song) => (
              <div 
                key={song.id} 
                className="group p-4 rounded-xl bg-card border border-border hover:bg-secondary/40 transition-colors cursor-pointer relative"
                onClick={() => play(song, recs)}
              >
                <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4 shadow-md">
                  <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-xl">
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="font-medium truncate text-foreground text-sm">{song.title}</h3>
                <p className="text-xs text-muted-foreground truncate mt-1">{song.artist}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore */}
      <div>
        <h2 className="text-2xl font-serif font-semibold mb-6 border-b border-border pb-2">Explore Catalog</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {songs?.map((song) => (
            <div 
              key={song.id} 
              className="group p-4 rounded-xl bg-card border border-border hover:bg-secondary/40 transition-colors cursor-pointer relative"
              onClick={() => play(song, songs)}
            >
              <div className="relative w-full aspect-square rounded-md overflow-hidden mb-4 shadow-md">
                <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-xl">
                    <Play className="w-5 h-5 fill-current ml-1" />
                  </div>
                </div>
              </div>
              <h3 className="font-medium truncate text-foreground text-sm">{song.title}</h3>
              <p className="text-xs text-muted-foreground truncate mt-1">{song.artist}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
