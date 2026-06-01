import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminStats, AiChatInput, AiResult, BroadcastInput, DeleteResponse, GetAiRecommendationsParams, GetHistoryParams, GetLikedSongsParams, GetNotificationsParams, GetPlaylistsParams, GetSongsParams, HealthStatus, LikeInput, Notification, NotificationInput, PlayHistory, PlayInput, Playlist, PlaylistDetail, PlaylistInput, PlaylistSongInput, PlaylistUpdate, SearchResults, SearchSongsParams, Song, SongInput, SongUpdate, UserProfile } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetSongsUrl: (params?: GetSongsParams) => string;
/**
 * @summary Get all songs
 */
export declare const getSongs: (params?: GetSongsParams, options?: RequestInit) => Promise<Song[]>;
export declare const getGetSongsQueryKey: (params?: GetSongsParams) => readonly ["/api/songs", ...GetSongsParams[]];
export declare const getGetSongsQueryOptions: <TData = Awaited<ReturnType<typeof getSongs>>, TError = ErrorType<unknown>>(params?: GetSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSongs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSongsQueryResult = NonNullable<Awaited<ReturnType<typeof getSongs>>>;
export type GetSongsQueryError = ErrorType<unknown>;
/**
 * @summary Get all songs
 */
export declare function useGetSongs<TData = Awaited<ReturnType<typeof getSongs>>, TError = ErrorType<unknown>>(params?: GetSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateSongUrl: () => string;
/**
 * @summary Create a song (admin only)
 */
export declare const createSong: (songInput: SongInput, options?: RequestInit) => Promise<Song>;
export declare const getCreateSongMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSong>>, TError, {
        data: BodyType<SongInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createSong>>, TError, {
    data: BodyType<SongInput>;
}, TContext>;
export type CreateSongMutationResult = NonNullable<Awaited<ReturnType<typeof createSong>>>;
export type CreateSongMutationBody = BodyType<SongInput>;
export type CreateSongMutationError = ErrorType<unknown>;
/**
* @summary Create a song (admin only)
*/
export declare const useCreateSong: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createSong>>, TError, {
        data: BodyType<SongInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createSong>>, TError, {
    data: BodyType<SongInput>;
}, TContext>;
export declare const getGetSongUrl: (id: number) => string;
/**
 * @summary Get a song by ID
 */
export declare const getSong: (id: number, options?: RequestInit) => Promise<Song>;
export declare const getGetSongQueryKey: (id: number) => readonly [`/api/songs/${number}`];
export declare const getGetSongQueryOptions: <TData = Awaited<ReturnType<typeof getSong>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSong>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getSong>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetSongQueryResult = NonNullable<Awaited<ReturnType<typeof getSong>>>;
export type GetSongQueryError = ErrorType<unknown>;
/**
 * @summary Get a song by ID
 */
export declare function useGetSong<TData = Awaited<ReturnType<typeof getSong>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getSong>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateSongUrl: (id: number) => string;
/**
 * @summary Update a song (admin only)
 */
export declare const updateSong: (id: number, songUpdate: SongUpdate, options?: RequestInit) => Promise<Song>;
export declare const getUpdateSongMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSong>>, TError, {
        id: number;
        data: BodyType<SongUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateSong>>, TError, {
    id: number;
    data: BodyType<SongUpdate>;
}, TContext>;
export type UpdateSongMutationResult = NonNullable<Awaited<ReturnType<typeof updateSong>>>;
export type UpdateSongMutationBody = BodyType<SongUpdate>;
export type UpdateSongMutationError = ErrorType<unknown>;
/**
* @summary Update a song (admin only)
*/
export declare const useUpdateSong: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateSong>>, TError, {
        id: number;
        data: BodyType<SongUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateSong>>, TError, {
    id: number;
    data: BodyType<SongUpdate>;
}, TContext>;
export declare const getDeleteSongUrl: (id: number) => string;
/**
 * @summary Delete a song (admin only)
 */
export declare const deleteSong: (id: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getDeleteSongMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSong>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteSong>>, TError, {
    id: number;
}, TContext>;
export type DeleteSongMutationResult = NonNullable<Awaited<ReturnType<typeof deleteSong>>>;
export type DeleteSongMutationError = ErrorType<unknown>;
/**
* @summary Delete a song (admin only)
*/
export declare const useDeleteSong: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteSong>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteSong>>, TError, {
    id: number;
}, TContext>;
export declare const getGetFeaturedSongsUrl: () => string;
/**
 * @summary Get featured/trending songs
 */
export declare const getFeaturedSongs: (options?: RequestInit) => Promise<Song[]>;
export declare const getGetFeaturedSongsQueryKey: () => readonly ["/api/songs/featured"];
export declare const getGetFeaturedSongsQueryOptions: <TData = Awaited<ReturnType<typeof getFeaturedSongs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getFeaturedSongs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetFeaturedSongsQueryResult = NonNullable<Awaited<ReturnType<typeof getFeaturedSongs>>>;
export type GetFeaturedSongsQueryError = ErrorType<unknown>;
/**
 * @summary Get featured/trending songs
 */
export declare function useGetFeaturedSongs<TData = Awaited<ReturnType<typeof getFeaturedSongs>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getFeaturedSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetPlaylistsUrl: (params?: GetPlaylistsParams) => string;
/**
 * @summary Get playlists (public or user's)
 */
export declare const getPlaylists: (params?: GetPlaylistsParams, options?: RequestInit) => Promise<Playlist[]>;
export declare const getGetPlaylistsQueryKey: (params?: GetPlaylistsParams) => readonly ["/api/playlists", ...GetPlaylistsParams[]];
export declare const getGetPlaylistsQueryOptions: <TData = Awaited<ReturnType<typeof getPlaylists>>, TError = ErrorType<unknown>>(params?: GetPlaylistsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlaylists>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlaylists>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlaylistsQueryResult = NonNullable<Awaited<ReturnType<typeof getPlaylists>>>;
export type GetPlaylistsQueryError = ErrorType<unknown>;
/**
 * @summary Get playlists (public or user's)
 */
export declare function useGetPlaylists<TData = Awaited<ReturnType<typeof getPlaylists>>, TError = ErrorType<unknown>>(params?: GetPlaylistsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlaylists>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreatePlaylistUrl: () => string;
/**
 * @summary Create a playlist
 */
export declare const createPlaylist: (playlistInput: PlaylistInput, options?: RequestInit) => Promise<Playlist>;
export declare const getCreatePlaylistMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPlaylist>>, TError, {
        data: BodyType<PlaylistInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createPlaylist>>, TError, {
    data: BodyType<PlaylistInput>;
}, TContext>;
export type CreatePlaylistMutationResult = NonNullable<Awaited<ReturnType<typeof createPlaylist>>>;
export type CreatePlaylistMutationBody = BodyType<PlaylistInput>;
export type CreatePlaylistMutationError = ErrorType<unknown>;
/**
* @summary Create a playlist
*/
export declare const useCreatePlaylist: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createPlaylist>>, TError, {
        data: BodyType<PlaylistInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createPlaylist>>, TError, {
    data: BodyType<PlaylistInput>;
}, TContext>;
export declare const getGetPlaylistUrl: (id: number) => string;
/**
 * @summary Get playlist with songs
 */
export declare const getPlaylist: (id: number, options?: RequestInit) => Promise<PlaylistDetail>;
export declare const getGetPlaylistQueryKey: (id: number) => readonly [`/api/playlists/${number}`];
export declare const getGetPlaylistQueryOptions: <TData = Awaited<ReturnType<typeof getPlaylist>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlaylist>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPlaylist>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPlaylistQueryResult = NonNullable<Awaited<ReturnType<typeof getPlaylist>>>;
export type GetPlaylistQueryError = ErrorType<unknown>;
/**
 * @summary Get playlist with songs
 */
export declare function useGetPlaylist<TData = Awaited<ReturnType<typeof getPlaylist>>, TError = ErrorType<unknown>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPlaylist>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdatePlaylistUrl: (id: number) => string;
/**
 * @summary Update a playlist
 */
export declare const updatePlaylist: (id: number, playlistUpdate: PlaylistUpdate, options?: RequestInit) => Promise<Playlist>;
export declare const getUpdatePlaylistMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePlaylist>>, TError, {
        id: number;
        data: BodyType<PlaylistUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updatePlaylist>>, TError, {
    id: number;
    data: BodyType<PlaylistUpdate>;
}, TContext>;
export type UpdatePlaylistMutationResult = NonNullable<Awaited<ReturnType<typeof updatePlaylist>>>;
export type UpdatePlaylistMutationBody = BodyType<PlaylistUpdate>;
export type UpdatePlaylistMutationError = ErrorType<unknown>;
/**
* @summary Update a playlist
*/
export declare const useUpdatePlaylist: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updatePlaylist>>, TError, {
        id: number;
        data: BodyType<PlaylistUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updatePlaylist>>, TError, {
    id: number;
    data: BodyType<PlaylistUpdate>;
}, TContext>;
export declare const getDeletePlaylistUrl: (id: number) => string;
/**
 * @summary Delete a playlist
 */
export declare const deletePlaylist: (id: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getDeletePlaylistMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePlaylist>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deletePlaylist>>, TError, {
    id: number;
}, TContext>;
export type DeletePlaylistMutationResult = NonNullable<Awaited<ReturnType<typeof deletePlaylist>>>;
export type DeletePlaylistMutationError = ErrorType<unknown>;
/**
* @summary Delete a playlist
*/
export declare const useDeletePlaylist: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deletePlaylist>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deletePlaylist>>, TError, {
    id: number;
}, TContext>;
export declare const getAddSongToPlaylistUrl: (id: number) => string;
/**
 * @summary Add song to playlist
 */
export declare const addSongToPlaylist: (id: number, playlistSongInput: PlaylistSongInput, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getAddSongToPlaylistMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addSongToPlaylist>>, TError, {
        id: number;
        data: BodyType<PlaylistSongInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof addSongToPlaylist>>, TError, {
    id: number;
    data: BodyType<PlaylistSongInput>;
}, TContext>;
export type AddSongToPlaylistMutationResult = NonNullable<Awaited<ReturnType<typeof addSongToPlaylist>>>;
export type AddSongToPlaylistMutationBody = BodyType<PlaylistSongInput>;
export type AddSongToPlaylistMutationError = ErrorType<unknown>;
/**
* @summary Add song to playlist
*/
export declare const useAddSongToPlaylist: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof addSongToPlaylist>>, TError, {
        id: number;
        data: BodyType<PlaylistSongInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof addSongToPlaylist>>, TError, {
    id: number;
    data: BodyType<PlaylistSongInput>;
}, TContext>;
export declare const getRemoveSongFromPlaylistUrl: (id: number, songId: number) => string;
/**
 * @summary Remove song from playlist
 */
export declare const removeSongFromPlaylist: (id: number, songId: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getRemoveSongFromPlaylistMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSongFromPlaylist>>, TError, {
        id: number;
        songId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof removeSongFromPlaylist>>, TError, {
    id: number;
    songId: number;
}, TContext>;
export type RemoveSongFromPlaylistMutationResult = NonNullable<Awaited<ReturnType<typeof removeSongFromPlaylist>>>;
export type RemoveSongFromPlaylistMutationError = ErrorType<unknown>;
/**
* @summary Remove song from playlist
*/
export declare const useRemoveSongFromPlaylist: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof removeSongFromPlaylist>>, TError, {
        id: number;
        songId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof removeSongFromPlaylist>>, TError, {
    id: number;
    songId: number;
}, TContext>;
export declare const getGetLikedSongsUrl: (params: GetLikedSongsParams) => string;
/**
 * @summary Get user's liked songs
 */
export declare const getLikedSongs: (params: GetLikedSongsParams, options?: RequestInit) => Promise<Song[]>;
export declare const getGetLikedSongsQueryKey: (params?: GetLikedSongsParams) => readonly ["/api/liked", ...GetLikedSongsParams[]];
export declare const getGetLikedSongsQueryOptions: <TData = Awaited<ReturnType<typeof getLikedSongs>>, TError = ErrorType<unknown>>(params: GetLikedSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLikedSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLikedSongs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLikedSongsQueryResult = NonNullable<Awaited<ReturnType<typeof getLikedSongs>>>;
export type GetLikedSongsQueryError = ErrorType<unknown>;
/**
 * @summary Get user's liked songs
 */
export declare function useGetLikedSongs<TData = Awaited<ReturnType<typeof getLikedSongs>>, TError = ErrorType<unknown>>(params: GetLikedSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLikedSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getLikeSongUrl: () => string;
/**
 * @summary Like a song
 */
export declare const likeSong: (likeInput: LikeInput, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getLikeSongMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof likeSong>>, TError, {
        data: BodyType<LikeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof likeSong>>, TError, {
    data: BodyType<LikeInput>;
}, TContext>;
export type LikeSongMutationResult = NonNullable<Awaited<ReturnType<typeof likeSong>>>;
export type LikeSongMutationBody = BodyType<LikeInput>;
export type LikeSongMutationError = ErrorType<unknown>;
/**
* @summary Like a song
*/
export declare const useLikeSong: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof likeSong>>, TError, {
        data: BodyType<LikeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof likeSong>>, TError, {
    data: BodyType<LikeInput>;
}, TContext>;
export declare const getUnlikeSongUrl: (userId: string, songId: number) => string;
/**
 * @summary Unlike a song
 */
export declare const unlikeSong: (userId: string, songId: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getUnlikeSongMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unlikeSong>>, TError, {
        userId: string;
        songId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unlikeSong>>, TError, {
    userId: string;
    songId: number;
}, TContext>;
export type UnlikeSongMutationResult = NonNullable<Awaited<ReturnType<typeof unlikeSong>>>;
export type UnlikeSongMutationError = ErrorType<unknown>;
/**
* @summary Unlike a song
*/
export declare const useUnlikeSong: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unlikeSong>>, TError, {
        userId: string;
        songId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unlikeSong>>, TError, {
    userId: string;
    songId: number;
}, TContext>;
export declare const getGetHistoryUrl: (params: GetHistoryParams) => string;
/**
 * @summary Get user's play history
 */
export declare const getHistory: (params: GetHistoryParams, options?: RequestInit) => Promise<PlayHistory[]>;
export declare const getGetHistoryQueryKey: (params?: GetHistoryParams) => readonly ["/api/history", ...GetHistoryParams[]];
export declare const getGetHistoryQueryOptions: <TData = Awaited<ReturnType<typeof getHistory>>, TError = ErrorType<unknown>>(params: GetHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getHistory>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetHistoryQueryResult = NonNullable<Awaited<ReturnType<typeof getHistory>>>;
export type GetHistoryQueryError = ErrorType<unknown>;
/**
 * @summary Get user's play history
 */
export declare function useGetHistory<TData = Awaited<ReturnType<typeof getHistory>>, TError = ErrorType<unknown>>(params: GetHistoryParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getHistory>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRecordPlayUrl: () => string;
/**
 * @summary Record a song play
 */
export declare const recordPlay: (playInput: PlayInput, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getRecordPlayMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordPlay>>, TError, {
        data: BodyType<PlayInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof recordPlay>>, TError, {
    data: BodyType<PlayInput>;
}, TContext>;
export type RecordPlayMutationResult = NonNullable<Awaited<ReturnType<typeof recordPlay>>>;
export type RecordPlayMutationBody = BodyType<PlayInput>;
export type RecordPlayMutationError = ErrorType<unknown>;
/**
* @summary Record a song play
*/
export declare const useRecordPlay: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordPlay>>, TError, {
        data: BodyType<PlayInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof recordPlay>>, TError, {
    data: BodyType<PlayInput>;
}, TContext>;
export declare const getSearchSongsUrl: (params: SearchSongsParams) => string;
/**
 * @summary Search songs
 */
export declare const searchSongs: (params: SearchSongsParams, options?: RequestInit) => Promise<SearchResults>;
export declare const getSearchSongsQueryKey: (params?: SearchSongsParams) => readonly ["/api/search", ...SearchSongsParams[]];
export declare const getSearchSongsQueryOptions: <TData = Awaited<ReturnType<typeof searchSongs>>, TError = ErrorType<unknown>>(params: SearchSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof searchSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof searchSongs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type SearchSongsQueryResult = NonNullable<Awaited<ReturnType<typeof searchSongs>>>;
export type SearchSongsQueryError = ErrorType<unknown>;
/**
 * @summary Search songs
 */
export declare function useSearchSongs<TData = Awaited<ReturnType<typeof searchSongs>>, TError = ErrorType<unknown>>(params: SearchSongsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof searchSongs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetNotificationsUrl: (params: GetNotificationsParams) => string;
/**
 * @summary Get user notifications
 */
export declare const getNotifications: (params: GetNotificationsParams, options?: RequestInit) => Promise<Notification[]>;
export declare const getGetNotificationsQueryKey: (params?: GetNotificationsParams) => readonly ["/api/notifications", ...GetNotificationsParams[]];
export declare const getGetNotificationsQueryOptions: <TData = Awaited<ReturnType<typeof getNotifications>>, TError = ErrorType<unknown>>(params: GetNotificationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNotifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNotifications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNotificationsQueryResult = NonNullable<Awaited<ReturnType<typeof getNotifications>>>;
export type GetNotificationsQueryError = ErrorType<unknown>;
/**
 * @summary Get user notifications
 */
export declare function useGetNotifications<TData = Awaited<ReturnType<typeof getNotifications>>, TError = ErrorType<unknown>>(params: GetNotificationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNotifications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSendNotificationUrl: () => string;
/**
 * @summary Send notification (admin)
 */
export declare const sendNotification: (notificationInput: NotificationInput, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getSendNotificationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendNotification>>, TError, {
        data: BodyType<NotificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendNotification>>, TError, {
    data: BodyType<NotificationInput>;
}, TContext>;
export type SendNotificationMutationResult = NonNullable<Awaited<ReturnType<typeof sendNotification>>>;
export type SendNotificationMutationBody = BodyType<NotificationInput>;
export type SendNotificationMutationError = ErrorType<unknown>;
/**
* @summary Send notification (admin)
*/
export declare const useSendNotification: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendNotification>>, TError, {
        data: BodyType<NotificationInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendNotification>>, TError, {
    data: BodyType<NotificationInput>;
}, TContext>;
export declare const getMarkNotificationReadUrl: (id: number) => string;
/**
 * @summary Mark notification as read
 */
export declare const markNotificationRead: (id: number, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getMarkNotificationReadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: number;
}, TContext>;
export type MarkNotificationReadMutationResult = NonNullable<Awaited<ReturnType<typeof markNotificationRead>>>;
export type MarkNotificationReadMutationError = ErrorType<unknown>;
/**
* @summary Mark notification as read
*/
export declare const useMarkNotificationRead: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof markNotificationRead>>, TError, {
    id: number;
}, TContext>;
export declare const getGetAdminStatsUrl: () => string;
/**
 * @summary Get admin dashboard statistics
 */
export declare const getAdminStats: (options?: RequestInit) => Promise<AdminStats>;
export declare const getGetAdminStatsQueryKey: () => readonly ["/api/admin/stats"];
export declare const getGetAdminStatsQueryOptions: <TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminStats>>>;
export type GetAdminStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get admin dashboard statistics
 */
export declare function useGetAdminStats<TData = Awaited<ReturnType<typeof getAdminStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getBroadcastNotificationUrl: () => string;
/**
 * @summary Broadcast notification to all users
 */
export declare const broadcastNotification: (broadcastInput: BroadcastInput, options?: RequestInit) => Promise<DeleteResponse>;
export declare const getBroadcastNotificationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
        data: BodyType<BroadcastInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
    data: BodyType<BroadcastInput>;
}, TContext>;
export type BroadcastNotificationMutationResult = NonNullable<Awaited<ReturnType<typeof broadcastNotification>>>;
export type BroadcastNotificationMutationBody = BodyType<BroadcastInput>;
export type BroadcastNotificationMutationError = ErrorType<unknown>;
/**
* @summary Broadcast notification to all users
*/
export declare const useBroadcastNotification: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
        data: BodyType<BroadcastInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof broadcastNotification>>, TError, {
    data: BodyType<BroadcastInput>;
}, TContext>;
export declare const getGetAdminUsersUrl: () => string;
/**
 * @summary Get all users (admin)
 */
export declare const getAdminUsers: (options?: RequestInit) => Promise<UserProfile[]>;
export declare const getGetAdminUsersQueryKey: () => readonly ["/api/admin/users"];
export declare const getGetAdminUsersQueryOptions: <TData = Awaited<ReturnType<typeof getAdminUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminUsersQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminUsers>>>;
export type GetAdminUsersQueryError = ErrorType<unknown>;
/**
 * @summary Get all users (admin)
 */
export declare function useGetAdminUsers<TData = Awaited<ReturnType<typeof getAdminUsers>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAiChatUrl: () => string;
/**
 * @summary Send prompt to AI (Gemini)
 */
export declare const aiChat: (aiChatInput: AiChatInput, options?: RequestInit) => Promise<AiResult>;
export declare const getAiChatMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiChat>>, TError, {
        data: BodyType<AiChatInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof aiChat>>, TError, {
    data: BodyType<AiChatInput>;
}, TContext>;
export type AiChatMutationResult = NonNullable<Awaited<ReturnType<typeof aiChat>>>;
export type AiChatMutationBody = BodyType<AiChatInput>;
export type AiChatMutationError = ErrorType<unknown>;
/**
* @summary Send prompt to AI (Gemini)
*/
export declare const useAiChat: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof aiChat>>, TError, {
        data: BodyType<AiChatInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof aiChat>>, TError, {
    data: BodyType<AiChatInput>;
}, TContext>;
export declare const getGetAiRecommendationsUrl: (params: GetAiRecommendationsParams) => string;
/**
 * @summary Get AI song recommendations for user
 */
export declare const getAiRecommendations: (params: GetAiRecommendationsParams, options?: RequestInit) => Promise<Song[]>;
export declare const getGetAiRecommendationsQueryKey: (params?: GetAiRecommendationsParams) => readonly ["/api/ai/recommend", ...GetAiRecommendationsParams[]];
export declare const getGetAiRecommendationsQueryOptions: <TData = Awaited<ReturnType<typeof getAiRecommendations>>, TError = ErrorType<unknown>>(params: GetAiRecommendationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAiRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAiRecommendations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAiRecommendationsQueryResult = NonNullable<Awaited<ReturnType<typeof getAiRecommendations>>>;
export type GetAiRecommendationsQueryError = ErrorType<unknown>;
/**
 * @summary Get AI song recommendations for user
 */
export declare function useGetAiRecommendations<TData = Awaited<ReturnType<typeof getAiRecommendations>>, TError = ErrorType<unknown>>(params: GetAiRecommendationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAiRecommendations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map