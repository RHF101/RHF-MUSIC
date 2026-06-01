import React, { useState } from 'react';
import { Link } from 'wouter';
import { useGetPlaylists, useCreatePlaylist, getGetPlaylistsQueryKey } from '@workspace/api-client-react';
import { useAuth } from '../hooks/use-auth';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Music2, Library as LibraryIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Library() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const { data: userPlaylists, isLoading } = useGetPlaylists(
    { userId: user?.id },
    { query: { enabled: !!user?.id, queryKey: getGetPlaylistsQueryKey({ userId: user?.id }) } }
  );
  const { data: publicPlaylists } = useGetPlaylists(
    { isPublic: true },
    { query: { queryKey: getGetPlaylistsQueryKey({ isPublic: true }) } }
  );

  const createPlaylist = useCreatePlaylist({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetPlaylistsQueryKey({ userId: user?.id }) });
        toast({ title: 'Playlist created' });
        setOpen(false);
        setName('');
      },
    },
  });

  const handleCreate = () => {
    if (!name.trim() || !user) return;
    createPlaylist.mutate({ data: { name: name.trim(), userId: user.id, isPublic: false } });
  };

  if (!user) {
    return (
      <div className="p-8 pb-32">
        <h1 className="text-4xl font-serif font-bold mb-8">Your Library</h1>
        <div className="text-center py-20">
          <LibraryIcon className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary" />
          <p className="text-muted-foreground text-lg mb-4">Log in to access your library</p>
          <Link href="/auth/login">
            <Button className="bg-primary text-primary-foreground">Log In</Button>
          </Link>
        </div>
        {publicPlaylists && publicPlaylists.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-6">Public Playlists</h2>
            <PlaylistGrid playlists={publicPlaylists} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 pb-32">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-serif font-bold">Your Library</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-playlist" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              New Playlist
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="font-serif">Create Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label htmlFor="playlist-name">Name</Label>
                <Input
                  id="playlist-name"
                  data-testid="input-playlist-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Playlist"
                  className="mt-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
              </div>
              <Button
                data-testid="button-submit-playlist"
                onClick={handleCreate}
                disabled={createPlaylist.isPending || !name.trim()}
                className="w-full bg-primary text-primary-foreground"
              >
                {createPlaylist.isPending ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <div className="text-muted-foreground">Loading...</div>}

      {userPlaylists && userPlaylists.length > 0 ? (
        <div className="mb-12">
          <h2 className="text-xl font-serif font-semibold mb-4">My Playlists</h2>
          <PlaylistGrid playlists={userPlaylists} />
        </div>
      ) : (
        <div className="text-center py-12 mb-12">
          <Music2 className="w-12 h-12 mx-auto mb-3 opacity-20 text-primary" />
          <p className="text-muted-foreground">No playlists yet. Create your first one!</p>
        </div>
      )}

      {publicPlaylists && publicPlaylists.length > 0 && (
        <div>
          <h2 className="text-xl font-serif font-semibold mb-4">Featured Playlists</h2>
          <PlaylistGrid playlists={publicPlaylists} />
        </div>
      )}
    </div>
  );
}

function PlaylistGrid({ playlists }: { playlists: any[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {playlists.map((pl) => (
        <Link key={pl.id} href={`/playlist/${pl.id}`}>
          <div
            data-testid={`card-playlist-${pl.id}`}
            className="group p-4 rounded-xl bg-card border border-border hover:bg-secondary/40 transition-all duration-200 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
          >
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-3 bg-secondary shadow-md">
              {pl.coverUrl
                ? <img src={pl.coverUrl} alt={pl.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                : <div className="w-full h-full flex items-center justify-center"><Music2 className="w-8 h-8 text-muted-foreground" /></div>
              }
            </div>
            <p className="font-semibold truncate text-sm">{pl.name}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">{pl.description || `${pl.songCount} songs`}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
