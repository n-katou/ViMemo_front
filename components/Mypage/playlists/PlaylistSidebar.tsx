import React, { useState } from "react";

interface SidebarProps {
  playlists: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddClick: () => void;
  onDelete: (id: number) => void;
  onRename: (id: number, newName: string) => void;
}

const PlaylistSidebar: React.FC<SidebarProps> = ({
  playlists,
  selectedId,
  onSelect,
  onAddClick,
  onDelete,
  onRename,
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  return (
    <div className="w-1/4 bg-gray-50 p-4 border-r pt-16 overflow-y-auto h-screen">
      <h2 className="text-xl font-bold mb-4 text-gray-800">プレイリスト</h2>
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className={`cursor-pointer p-2 mb-2 rounded ${playlist.id === selectedId ? "bg-blue-200" : "hover:bg-gray-100"} text-gray-800`}
          onClick={() => onSelect(playlist.id)}
        >
          <div className="flex justify-between items-center">
            {editingId === playlist.id ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onBlur={() => {
                  if (newName.trim() && newName !== playlist.name) {
                    onRename(playlist.id, newName.trim());
                  }
                  setEditingId(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    if (newName.trim()) {
                      onRename(playlist.id, newName.trim());
                    }
                    setEditingId(null);
                  }
                }}
                autoFocus
                className="w-full px-1 py-0.5 border rounded text-sm"
              />
            ) : (
              <span className="truncate" title={playlist.name}>{playlist.name}</span>
            )}

            <div className="flex items-center gap-1 ml-2">
              <button
                className="text-blue-500 text-xs hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(playlist.id);
                  setNewName(playlist.name);
                }}
              >
                編集
              </button>
              <button
                className="text-red-500 text-xs hover:underline"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(playlist.id);
                }}
              >
                削除
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={onAddClick}
        className="mt-4 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
      >
        + 新規作成
      </button>
    </div>
  );
};

export default PlaylistSidebar;
