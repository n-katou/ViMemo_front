import React from "react";

interface SidebarProps {
  playlists: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddClick: () => void;
}

const PlaylistSidebar: React.FC<SidebarProps> = ({ playlists, selectedId, onSelect, onAddClick }) => (
  <div className="w-1/4 bg-gray-50 p-4 border-r">
    <h2 className="text-xl font-bold mb-4">プレイリスト</h2>
    {playlists.map((playlist) => (
      <div
        key={playlist.id}
        className={`cursor-pointer p-2 mb-2 rounded ${playlist.id === selectedId ? "bg-blue-200" : "hover:bg-gray-100"}`}
        onClick={() => onSelect(playlist.id)}
      >
        {playlist.name}
      </div>
    ))}
    <button onClick={onAddClick} className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full">
      + 新規作成
    </button>
  </div>
);

export default PlaylistSidebar;
