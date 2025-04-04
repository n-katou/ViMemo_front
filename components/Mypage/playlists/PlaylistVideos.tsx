import React, { useState } from "react";
import FavoriteVideoCard from "../favorite_videos/FavoriteVideoCard";
import { YoutubeVideo } from "../../../types/youtubeVideo"; // ← これに合わせて定義

// 各PlaylistItemの型（動画データ込み）
type PlaylistItem = {
  id: number;
  position: number;
  youtube_video: YoutubeVideo;
};

// propsの型
type Props = {
  playlistItems: PlaylistItem[];
  setPlaylistItems: React.Dispatch<React.SetStateAction<PlaylistItem[]>>;
  jwtToken: string;
  playlistId: number;
};

const PlaylistVideos: React.FC<Props> = ({
  playlistItems,
  setPlaylistItems,
  jwtToken,
  playlistId,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

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
      if (!res.ok) throw new Error("Failed to save order");

      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
    } catch (err) {
      console.error("並び順保存に失敗:", err);
    }
  };

  return (
    <div className="w-full px-6 py-8 pt-16 pb-24">
      {/* Tooltip表示 */}
      {showTooltip && (
        <div className="fixed top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 z-50 px-3 py-2 bg-green-500 text-white text-sm rounded shadow-md animate-fadeIn">
          保存しました。
        </div>
      )}
      {playlistId && (
        <>
          <div className="relative inline-block mb-4">
            <button
              onClick={handleSaveOrder}
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              並び順を保存する
            </button>

          </div>
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {playlistItems.map((item, index) => (
          <FavoriteVideoCard
            key={item.id}
            index={index}
            video={item.youtube_video}
            notes={item.youtube_video.notes}
            currentUser={null}
            handleLikeVideo={() => { }}
            handleUnlikeVideo={() => { }}
            moveVideo={moveVideo}
            className="w-full"
          />
        ))}
      </div>
    </div>
  );
};

export default PlaylistVideos;
