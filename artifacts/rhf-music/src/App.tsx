import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { Layout } from "@/components/Layout";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import Library from "@/pages/Library";
import PlaylistDetail from "@/pages/PlaylistDetail";
import LikedSongs from "@/pages/LikedSongs";
import History from "@/pages/History";
import Admin from "@/pages/Admin";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import { AuthProvider } from "@/hooks/use-auth";
import { PlayerProvider } from "@/context/PlayerContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/">
        <Layout><Home /></Layout>
      </Route>
      <Route path="/search">
        <Layout><Search /></Layout>
      </Route>
      <Route path="/library">
        <Layout><Library /></Layout>
      </Route>
      <Route path="/playlist/:id">
        {(params) => <Layout><PlaylistDetail /></Layout>}
      </Route>
      <Route path="/liked">
        <Layout><LikedSongs /></Layout>
      </Route>
      <Route path="/history">
        <Layout><History /></Layout>
      </Route>
      <Route path="/admin">
        <Layout><Admin /></Layout>
      </Route>
      <Route>
        <Layout><NotFound /></Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PlayerProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </PlayerProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
