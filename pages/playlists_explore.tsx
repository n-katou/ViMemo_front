"use client";

import React, { useEffect, useState } from "react";
import { fetchPublicPlaylists, fetchUserLikeStatus, favoriteVideoHandleLike, favoriteVideoHandleUnlike } from "@/components/Playlists/playlistUtils";
import PlaylistVideoCard from "@/components/Playlists/PlaylistVideoCard";
import { YoutubeVideo } from '../types/youtubeVideo';
import { useAuth } from '../context/AuthContext';
import { fetchVideoLikes } from '../src/api';

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
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}分${sec}秒`;
};

const PlaylistsExplorePage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const [playlists, setPlaylists] = useState<PublicPlaylist[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!jwtToken) return;

    const fetchData = async () => {
      try {
        const res: PublicPlaylist[] = await fetchPublicPlaylists();

        const withLikes: PublicPlaylist[] = await Promise.all(
          res.map(async (playlist: PublicPlaylist): Promise<PublicPlaylist> => {
            const playlistItemsWithLikes: PlaylistItem[] = await Promise.all(
              playlist.playlist_items.map(async (item: PlaylistItem): Promise<PlaylistItem> => {
                const userLike = await fetchUserLikeStatus(item.youtube_video.id, jwtToken);
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
            return { ...playlist, playlist_items: playlistItemsWithLikes };
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

  const toggleExpand = (id: number) => {
    setExpandedId((prev) => {
      const next = prev === id ? null : id;
      console.log("Expanded ID set to:", next);
      return next;
    });
  };

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

  if (loading) return <div className="p-6 text-gray-500">読み込み中...</div>;

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

            <button
              onClick={() => toggleExpand(pl.id)}
              className="mt-2 text-indigo-600 hover:underline text-sm"
            >
              {expandedId === pl.id ? "▲ 閉じる" : "▼ 中身を表示"}
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
