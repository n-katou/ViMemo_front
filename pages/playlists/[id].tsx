// pages/playlists/[id].tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { YoutubeVideo } from '@/types/youtubeVideo';
import { fetchPublicPlaylists, fetchUserLikeStatus, favoriteVideoHandleLike, favoriteVideoHandleUnlike } from '@/components/Playlists/playlistUtils';
import { fetchVideoLikes } from '../../src/api';
import PlaylistVideoCard from '@/components/Playlists/PlaylistVideoCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';

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
  return `${h > 0 ? `${h}時間` : ''}${m > 0 ? `${m}分` : ''}${s}秒`;
};

const PlaylistDetailPage: React.FC = () => {
  const { currentUser, jwtToken } = useAuth();
  const router = useRouter();
  const { id } = router.query;

  const [playlist, setPlaylist] = useState<PublicPlaylist | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const all: PublicPlaylist[] = await fetchPublicPlaylists(jwtToken ?? undefined);
        const found = all.find((p) => p.id === Number(id));
        if (!found) return;

        const playlistItemsWithLikes = await Promise.all(
          found.playlist_items.map(async (item) => {
            if (!jwtToken) return item;
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

        setPlaylist({ ...found, playlist_items: playlistItemsWithLikes });
      } catch (e) {
        console.error("プレイリスト取得失敗", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, jwtToken]);

  const updateVideoState = (videoId: number, updateFn: (v: YoutubeVideo) => YoutubeVideo) => {
    if (!playlist) return;
    setPlaylist({
      ...playlist,
      playlist_items: playlist.playlist_items.map((item) =>
        item.youtube_video.id === videoId ? { ...item, youtube_video: updateFn(item.youtube_video) } : item
      ),
    });
  };

  if (loading || !playlist) return <LoadingSpinner loading={loading} />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{playlist.name}</h1>
      <p className="text-sm text-gray-400  mb-1">作成者: {playlist.user.name}</p>
      <p className="text-sm text-gray-400  mb-1">
        動画数: {playlist.items_count}本 / 合計時間: {formatDuration(playlist.total_duration)}
      </p>
      <p className="text-xs text-gray-400 mb-4">
        作成日: {new Date(playlist.created_at).toLocaleDateString()}
      </p>

      <div className="space-y-4">
        {playlist.playlist_items.map((item, idx) => (
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
                (updateFn) => updateVideoState(id, updateFn)
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
                (updateFn) => updateVideoState(id, updateFn)
              )
            }
            className="shadow"
          />
        ))}
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/playlists_explore')}
          className="text-indigo-600 hover:text-indigo-800 transition font-semibold text-sm underline"
        >
          プレイリスト一覧に戻る
        </button>
      </div>
    </div>
  );
};

export default PlaylistDetailPage;
