"use client";

import React, { useEffect, useState } from "react";
import { fetchPublicPlaylists, fetchUserLikeStatus, favoriteVideoHandleLike, favoriteVideoHandleUnlike } from "@/components/Playlists/playlistUtils";
import { fetchVideoLikes } from '../src/api';
import PlaylistVideoCard from "@/components/Playlists/PlaylistVideoCard";
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from "@/components/LoadingSpinner";
import { BsTwitterX } from "react-icons/bs";
import { useRouter } from 'next/router';

interface PlaylistItem {
  id: number;
  youtube_video: YoutubeVideo;
}

interface PublicPlaylist {
  id: number;
  name: string;
  user: {
    id: number;
    name: string;
  };
  items_count: number;
  total_duration: number;
  created_at: string;
  playlist_items: PlaylistItem[];
}

const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const hDisplay = h > 0 ? `${h}時間` : '';
  const mDisplay = m > 0 ? `${m}分` : '';
  const sDisplay = `${s}秒`;

  return `${hDisplay}${mDisplay}${sDisplay}`;
};

const PlaylistsExplorePage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token: string | undefined = jwtToken ?? undefined;
        const res: PublicPlaylist[] = await fetchPublicPlaylists(token);

        const withLikes: PublicPlaylist[] = await Promise.all(
          res.map(async (playlist: PublicPlaylist): Promise<PublicPlaylist> => {
            const playlistItemsWithLikes: PlaylistItem[] = await Promise.all(
              playlist.playlist_items.map(async (item: PlaylistItem): Promise<PlaylistItem> => {
                if (!token) return item;

                const userLike = await fetchUserLikeStatus(item.youtube_video.id, token);
                return {
                  ...item,
                  youtube_video: {
                    ...item.youtube_video,
                    liked: !!userLike,
                    likeId: userLike?.id,
                  },
                };
              })
            );

            return {
              ...playlist,
              playlist_items: playlistItemsWithLikes,
            };
          })
        );

        setPlaylists(withLikes);
      } catch (err) {
        console.error("プレイリスト取得失敗", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [jwtToken]);

  // 動画の状態を更新
  const updateVideoState = (
    videoId: number,
    updateFn: (video: YoutubeVideo) => YoutubeVideo
  ) => {
    setPlaylists((prev: PublicPlaylist[]) =>
      prev.map((playlist: PublicPlaylist) => ({
        ...playlist,
        playlist_items: playlist.playlist_items.map((item: PlaylistItem) =>
          item.youtube_video.id === videoId
            ? { ...item, youtube_video: updateFn(item.youtube_video) }
            : item
        ),
      }))
    );
  };

  if (loading) return <LoadingSpinner loading={loading} />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">みんなのプレイリスト一覧</h1>
      <div className="flex flex-col gap-6">
        {playlists.map((pl: PublicPlaylist) => (
          <div key={pl.id} className="bg-white shadow rounded p-4">
            <h2 className="text-gray-600 text-lg font-semibold mb-1">{pl.name}</h2>
            <p className="text-sm text-gray-600 mb-1">
              作成者: <span className="font-medium">{pl.user.name}</span>
            </p>
            <p className="text-sm text-gray-500">
              動画数: {pl.items_count}本 / 合計時間: {formatDuration(pl.total_duration)}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              作成日: {new Date(pl.created_at).toLocaleDateString()}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `🎵 ViMemoで公開されたプレイリスト「${pl.name}」をチェック！\n作成者: ${pl.user.name}\n\n#ViMemo #プレイリスト\n\n👇 見る：https://vimemo.app/playlists_explore#playlist-${pl.id}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-black hover:text-blue-500 transition-all text-sm"
              >
                <BsTwitterX size={18} />
                <span className="hidden sm:inline">シェア</span>
              </a>
            </p>
            <button
              onClick={() => router.push(`/playlists/${pl.id}`)}
              className="mt-2 text-indigo-600 hover:underline text-sm"
            >
              ▶ プレイリストを見る
            </button>

            {expandedId === pl.id && (
              <div className="mt-3 space-y-4">
                {pl.playlist_items.map((item, idx) => (
                  <PlaylistVideoCard
                    key={item.id}
                    video={item.youtube_video}
                    index={idx}
                    currentUser={currentUser}
                    handleLikeVideo={(id) =>
                      favoriteVideoHandleLike(
                        id,
                        jwtToken!,
                        fetchVideoLikes,
                        fetchUserLikeStatus,
                        (updateFn: (video: YoutubeVideo) => YoutubeVideo) =>
                          updateVideoState(id, updateFn)
                      )
                    }
                    handleUnlikeVideo={(id, likeId) =>
                      likeId &&
                      favoriteVideoHandleUnlike(
                        id,
                        likeId,
                        jwtToken!,
                        fetchVideoLikes,
                        fetchUserLikeStatus,
                        (updateFn: (video: YoutubeVideo) => YoutubeVideo) =>
                          updateVideoState(id, updateFn)
                      )
                    }
                    className="shadow"
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistsExplorePage;
