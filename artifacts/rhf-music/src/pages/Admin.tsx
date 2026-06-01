import React, { useState } from 'react';
import { Link } from 'wouter';
import {
  useGetAdminStats, getGetAdminStatsQueryKey,
  useGetAdminUsers, getGetAdminUsersQueryKey,
  useGetSongs, getGetSongsQueryKey,
  useCreateSong, useDeleteSong,
  useBroadcastNotification,
  useAiChat,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/use-auth';
import {
  Users, Music2, ListMusic, Play, Trash2, Plus, Send, Bot,
  BarChart3, Radio, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number | string; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-5">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold font-serif">{value?.toLocaleString()}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function formatDuration(sec: number) {
  if (!sec) return '0:00';
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'stats' | 'songs' | 'users' | 'ai' | 'broadcast'>('stats');
  const [broadcastMsg, setBroadcastMsg] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  const { data: stats } = useGetAdminStats({ query: { queryKey: getGetAdminStatsQueryKey() } });
  const { data: allUsers } = useGetAdminUsers({ query: { queryKey: getGetAdminUsersQueryKey(), enabled: activeTab === 'users' } });
  const { data: songs } = useGetSongs(undefined, { query: { queryKey: getGetSongsQueryKey(), enabled: activeTab === 'songs' } });

  const deleteSong = useDeleteSong({
    mutation: { onSuccess: () => { queryClient.invalidateQueries({ queryKey: getGetSongsQueryKey() }); toast({ title: 'Song deleted' }); } }
  });
  const broadcast = useBroadcastNotification({
    mutation: { onSuccess: () => { toast({ title: 'Notification broadcast sent!' }); setBroadcastMsg(''); } }
  });
  const aiChat = useAiChat();

  const form = useForm({
    defaultValues: { title: '', artist: '', album: '', audioUrl: '', coverUrl: '', duration: 0 },
  });
  const createSong = useCreateSong({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetSongsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetAdminStatsQueryKey() });
        toast({ title: 'Song added!' });
        setAddOpen(false);
        form.reset();
      },
    },
  });

  const handleAiPrompt = async () => {
    if (!aiPrompt.trim()) return;
    setAiResponse('Thinking...');
    aiChat.mutate(
      { data: { prompt: aiPrompt, userId: user?.id, context: 'admin' } },
      {
        onSuccess: (data) => {
          setAiResponse(data.response);
          if (data.action === 'upload_song' && data.data) {
            toast({ title: 'AI suggests adding a song', description: 'Check the response for details.' });
          }
        },
        onError: () => setAiResponse('AI request failed. Check your GEMINI_API_KEY.'),
      }
    );
  };

  if (!user) {
    return (
      <div className="p-8 text-center py-24">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20 text-primary" />
        <p className="text-muted-foreground text-lg mb-4">Admin access required</p>
        <Link href="/auth/login">
          <Button className="bg-primary text-primary-foreground">Log In</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'songs', label: 'Songs', icon: <Music2 className="w-4 h-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Assistant', icon: <Bot className="w-4 h-4" /> },
    { id: 'broadcast', label: 'Broadcast', icon: <Radio className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="p-8 pb-32">
      <h1 className="text-4xl font-serif font-bold mb-2">Admin Panel</h1>
      <p className="text-muted-foreground mb-8">Manage your platform</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 border-b border-border pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            data-testid={`tab-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap -mb-px ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard icon={<Users className="w-5 h-5 text-white" />} label="Total Users" value={stats?.totalUsers ?? 0} color="bg-blue-500/20 text-blue-400" />
            <StatCard icon={<Music2 className="w-5 h-5 text-white" />} label="Total Songs" value={stats?.totalSongs ?? 0} color="bg-primary/20 text-primary" />
            <StatCard icon={<ListMusic className="w-5 h-5 text-white" />} label="Playlists" value={stats?.totalPlaylists ?? 0} color="bg-purple-500/20 text-purple-400" />
            <StatCard icon={<Play className="w-5 h-5 text-white" />} label="Total Plays" value={stats?.totalPlays ?? 0} color="bg-green-500/20 text-green-400" />
          </div>

          {stats?.topSongs && stats.topSongs.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-semibold mb-4">Top Songs</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {stats.topSongs.map((song: any, i: number) => (
                  <div key={song.id} className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <span className="w-6 text-center text-sm font-bold text-primary">{i + 1}</span>
                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{song.playCount?.toLocaleString()} plays</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats?.recentActivity && stats.recentActivity.length > 0 && (
            <div>
              <h2 className="text-xl font-serif font-semibold mb-4">Recent Activity</h2>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {stats.recentActivity.map((entry: any, i: number) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-border last:border-0">
                    <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                      <img src={entry.song?.coverUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{entry.song?.title}</p>
                      <p className="text-xs text-muted-foreground truncate">by {entry.song?.artist}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(entry.playedAt).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Songs Management */}
      {activeTab === 'songs' && (
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-serif font-semibold">Song Management</h2>
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-add-song" className="bg-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />Add Song
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-lg">
                <DialogHeader>
                  <DialogTitle className="font-serif">Add New Song</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((data) => createSong.mutate({ data: { ...data, uploadedBy: user.id } }))} className="space-y-4 pt-2">
                    {(['title', 'artist', 'album', 'audioUrl', 'coverUrl'] as const).map((field) => (
                      <FormField key={field} control={form.control} name={field} render={({ field: f }) => (
                        <FormItem>
                          <FormLabel className="capitalize">{field.replace(/([A-Z])/g, ' $1')}</FormLabel>
                          <FormControl>
                            <Input data-testid={`input-song-${field}`} {...f} placeholder={field === 'audioUrl' ? 'https://...' : field === 'coverUrl' ? 'https://...' : ''} />
                          </FormControl>
                        </FormItem>
                      )} />
                    ))}
                    <FormField control={form.control} name="duration" render={({ field: f }) => (
                      <FormItem>
                        <FormLabel>Duration (seconds)</FormLabel>
                        <FormControl>
                          <Input data-testid="input-song-duration" type="number" {...f} onChange={(e) => f.onChange(Number(e.target.value))} />
                        </FormControl>
                      </FormItem>
                    )} />
                    <Button type="submit" disabled={createSong.isPending} className="w-full bg-primary text-primary-foreground">
                      {createSong.isPending ? 'Adding...' : 'Add Song'}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Song</th>
                  <th className="text-left px-5 py-3 hidden md:table-cell">Album</th>
                  <th className="text-left px-5 py-3 hidden lg:table-cell">Duration</th>
                  <th className="text-left px-5 py-3">Plays</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {(songs || []).map((song: any) => (
                  <tr key={song.id} data-testid={`song-admin-${song.id}`} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                          <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{song.title}</p>
                          <p className="text-xs text-muted-foreground">{song.artist}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground hidden md:table-cell">{song.album || '—'}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground hidden lg:table-cell">{formatDuration(song.duration)}</td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{song.playCount?.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <Button
                        data-testid={`button-delete-song-${song.id}`}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteSong.mutate({ id: song.id })}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users */}
      {activeTab === 'users' && (
        <div>
          <h2 className="text-xl font-serif font-semibold mb-5">User Management</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Email</th>
                  <th className="text-left px-5 py-3">Role</th>
                  <th className="text-left px-5 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {(allUsers || []).length === 0 && (
                  <tr><td colSpan={3} className="text-center text-muted-foreground py-8">No registered users yet</td></tr>
                )}
                {(allUsers || []).map((u: any) => (
                  <tr key={u.id} data-testid={`user-row-${u.id}`} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-5 py-3 text-sm">{u.email}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {activeTab === 'ai' && (
        <div className="max-w-2xl">
          <h2 className="text-xl font-serif font-semibold mb-2">AI Assistant</h2>
          <p className="text-sm text-muted-foreground mb-6">Use Gemini AI to manage your platform. Try: "Tambahkan lagu Shape of You oleh Ed Sheeran" or "Buat laporan 10 lagu terpopuler"</p>

          <div className="space-y-3 mb-4">
            {['Tampilkan 10 lagu paling populer minggu ini', 'Tambahkan lagu Bohemian Rhapsody oleh Queen', 'Rekomendasikan genre musik berdasarkan tren saat ini'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setAiPrompt(suggestion)}
                className="w-full text-left px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors text-sm text-muted-foreground flex items-center justify-between group"
              >
                <span>{suggestion}</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <Textarea
              data-testid="input-ai-prompt"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Ask the AI assistant..."
              className="min-h-[100px] bg-background border-border resize-none"
              onKeyDown={(e) => { if (e.key === 'Enter' && e.ctrlKey) handleAiPrompt(); }}
            />
            <Button
              data-testid="button-ai-send"
              onClick={handleAiPrompt}
              disabled={aiChat.isPending || !aiPrompt.trim()}
              className="bg-primary text-primary-foreground w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {aiChat.isPending ? 'Processing...' : 'Send (Ctrl+Enter)'}
            </Button>

            {aiResponse && (
              <div className="mt-4 p-4 bg-background rounded-xl border border-border">
                <div className="flex items-center gap-2 mb-2 text-primary text-sm font-medium">
                  <Bot className="w-4 h-4" />
                  AI Response
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Broadcast */}
      {activeTab === 'broadcast' && (
        <div className="max-w-xl">
          <h2 className="text-xl font-serif font-semibold mb-2">Broadcast Notification</h2>
          <p className="text-sm text-muted-foreground mb-6">Send a notification to all registered users.</p>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div>
              <Label>Message</Label>
              <Textarea
                data-testid="input-broadcast-message"
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                placeholder="Write your notification message..."
                className="mt-1.5 min-h-[120px] bg-background border-border resize-none"
              />
            </div>
            <Button
              data-testid="button-broadcast-send"
              onClick={() => broadcast.mutate({ data: { message: broadcastMsg } })}
              disabled={broadcast.isPending || !broadcastMsg.trim()}
              className="w-full bg-primary text-primary-foreground"
            >
              <Radio className="w-4 h-4 mr-2" />
              {broadcast.isPending ? 'Broadcasting...' : 'Send to All Users'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
