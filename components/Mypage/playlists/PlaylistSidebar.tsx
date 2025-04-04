import React, { useState } from "react";


interface Playlist {
  id: number;
  name: string;
}

interface SidebarProps {
  playlists: Playlist[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddClick: () => void;
  onDelete: (id: number) => void;
  onRename: (id: number, newName: string) => void;
  showSidebar?: boolean;
  onCloseSidebar: () => void;
}

const PlaylistSidebar: React.FC<SidebarProps> = ({
  playlists,
  selectedId,
  onSelect,
  onAddClick,
  onDelete,
  onRename,
  showSidebar
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newName, setNewName] = useState("");

  return (
    <div
      className={`
    fixed top-0 left-0 h-full w-4/5 sm:w-1/3 md:w-1/4 bg-gray-50 p-4 pt-16 border-r z-40
    transform transition-transform duration-300 ease-in-out
    ${showSidebar ? "translate-x-0" : "-translate-x-full"}
  `}
    >
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
            <div className="flex items-center gap-2 ml-2">
              {editingId === playlist.id ? (
                <>
                  <div className="flex gap-2 ml-2 whitespace-nowrap">
                    <button
                      className="flex justify-center items-center gap-1 px-2 py-1 w-[64px] text-sm text-white rounded transition"
                      style={{ backgroundColor: '#38bdf8' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0ea5e9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#38bdf8')}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (newName.trim()) onRename(playlist.id, newName.trim());
                        setEditingId(null);
                      }}
                    >
                      保存
                    </button>
                    <button
                      className="flex justify-center items-center gap-1 px-2 py-1 w-[64px] text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(null);
                        setNewName("");
                      }}
                    >
                      キャンセル
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    className="flex justify-center items-center gap-1 px-2 py-1 w-[64px] text-sm text-white border rounded transition"
                    style={{ backgroundColor: '#818cf8' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#818cf8')}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(playlist.id);
                      setNewName(playlist.name);
                    }}
                  >
                    編集
                  </button>
                  <button
                    className="flex justify-center items-center gap-1 px-2 py-1 w-[64px] text-sm text-red-600 bg-red-50 border border-red-100 rounded hover:bg-red-100 transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(playlist.id);
                    }}
                  >
                    削除
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      ))}
      <button
        onClick={onAddClick}
        className="mt-4 px-3 py-2 text-white rounded w-full transition-colors bg-teal-400 hover:bg-teal-500"
      >
        + 新規作成
      </button>
    </div>
  );
};

export default PlaylistSidebar;
