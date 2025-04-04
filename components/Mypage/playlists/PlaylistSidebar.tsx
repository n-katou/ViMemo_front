import React from "react";

interface SidebarProps {
  playlists: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddClick: () => void;
  onDelete: (id: number) => void;
}

const PlaylistSidebar: React.FC<SidebarProps> = ({ playlists, selectedId, onSelect, onAddClick, onDelete }) => (
  <div className="w-1/4 bg-gray-50 p-4 border-r pt-16 overflow-y-auto h-screen">
    <h2 className="text-xl font-bold mb-4  text-gray-800">プレイリスト</h2>
    {playlists.map((playlist) => (
      <div
        key={playlist.id}
        className={`cursor-pointer p-2 mb-2 rounded ${playlist.id === selectedId ? "bg-blue-200" : "hover:bg-gray-100"} text-gray-800`}
        onClick={() => onSelect(playlist.id)}
      >
        <div className="flex justify-between items-center">
          <span>{playlist.name}</span>
          <button
            className="text-red-500 text-xs ml-2 hover:underline"
            onClick={(e) => {
              e.stopPropagation(); // プレイリスト選択とバッティングしないように
              onDelete(playlist.id); // ← 後述のコールバック
            }}
          >
            削除
          </button>
        </div>
      </div>
    ))}
    <button onClick={onAddClick} className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
      + 新規作成
    </button>
  </div>
);

export default PlaylistSidebar;
