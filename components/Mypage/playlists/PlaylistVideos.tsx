import React, { useState } from "react";
import SimpleVideoCard from "./SimpleVideoCard";
import { YoutubeVideo } from "../../../types/youtubeVideo";

type PlaylistItem = {
  id: number;
  position: number;
  youtube_video: YoutubeVideo;
};

type Props = {
  playlistItems: PlaylistItem[];
  setPlaylistItems: React.Dispatch<React.SetStateAction<PlaylistItem[]>>;
  jwtToken: string;
  playlistId: number;
  playlistName?: string;
  onEditClick?: () => void;
  onSaveComplete?: () => void;
};

const PlaylistVideos: React.FC<Props> = ({
  playlistItems,
  setPlaylistItems,
  jwtToken,
  playlistId,
  playlistName,
  onEditClick,
  onSaveComplete,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moveVideo = (dragIndex: number, hoverIndex: number) => {
    const updated = [...playlistItems];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, moved);
    setPlaylistItems(updated);
  };

  const handleSaveOrder = async () => {
    const orderedIds = playlistItems.map((item) => item.id);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/items/sort`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify({ ordered_video_ids: orderedIds }),
        }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "並び順の保存に失敗しました");
      }

      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);

      onSaveComplete?.(); // ✅ 保存成功時に親からのコールバックを呼ぶ
    } catch (err) {
      console.error("並び順保存に失敗:", err);
      setError(err instanceof Error ? err.message : "並び順の保存中にエラーが発生しました");
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    const confirmDelete = window.confirm('この動画をプレイリストから削除しますか？');
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/playlists/${playlistId}/playlist_items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (!res.ok) throw new Error('削除に失敗しました');

      // ステートから削除
      setPlaylistItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('削除エラー:', err);
      setError('動画の削除に失敗しました');
      setTimeout(() => setError(null), 3000);
    }
  };

  return (
    <div className="w-full px-6 py-8 pt-16 pb-24">
      {/* Tooltip */}
      {showTooltip && (
        <div className="fixed top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-green-500 text-white text-sm rounded shadow-md animate-fadeIn">
          保存しました。
        </div>
      )}

      {/* エラーメッセージ */}
      {error && (
        <div className="fixed top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-red-500 text-white text-sm rounded shadow-md animate-fadeIn">
          {error}
        </div>
      )}

      {/* プレイリスト名 */}
      {playlistName && (
        <h2 className="text-xl font-bold mb-6" style={{ color: '#818cf8' }}>
          「{playlistName}」の動画一覧
        </h2>
      )}

      {/* アクションボタン */}
      {playlistId && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleSaveOrder}
            className="px-4 py-2 text-white rounded-md transition-colors"
            style={{ backgroundColor: '#c084fc' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#a855f7')} // 少し濃いめ
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#c084fc')}
          >
            並び順を保存する
          </button>
          {onEditClick && (
            <button
              onClick={onEditClick}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400  transition-colors duration-200 active:scale-95"
            >
              編集
            </button>
          )}
        </div>
      )}

      {/* 動画一覧 */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {playlistItems.map((item, index) => (
          <div
            key={item.id}
            className="w-full flex flex-col justify-between min-h-[100px] bg-white rounded shadow-md"
          >
            <SimpleVideoCard
              index={index}
              video={item.youtube_video}
              moveVideo={moveVideo}
              className="w-full"
              onRemove={() => handleRemoveItem(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistVideos;
