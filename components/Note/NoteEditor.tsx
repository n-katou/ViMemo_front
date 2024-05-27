import React from 'react';

interface NoteEditorProps {
  newContent: string;
  newMinutes: number;
  newSeconds: number;
  newIsVisible: boolean;
  setNewContent: (content: string) => void;
  setNewMinutes: (minutes: number) => void;
  setNewSeconds: (seconds: number) => void;
  setNewIsVisible: (isVisible: boolean) => void;
  handleEdit: () => void;
  setIsEditing: (isEditing: boolean) => void;
  padZero: (num: number) => string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  newContent,
  newMinutes,
  newSeconds,
  newIsVisible,
  setNewContent,
  setNewMinutes,
  setNewSeconds,
  setNewIsVisible,
  handleEdit,
  setIsEditing,
  padZero
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4 text-black">
      <span>メモ：</span>
      <textarea
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="メモを編集..."
        required
        className="textarea textarea-bordered w-full text-black border-2 border-gray-300"
      />
      <div className="form-control">
        <label className="label text-black">
          <span>タイムスタンプ:</span>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              value={newMinutes || ''}
              onChange={(e) => setNewMinutes(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              min="0"
              max="59"
              placeholder="00"
              className="input input-bordered text-center w-12 text-black border-2 border-gray-300"
            />
            <span>分</span>
            <input
              type="number"
              value={newSeconds || ''}
              onChange={(e) => setNewSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              min="0"
              max="59"
              placeholder="00"
              className="input input-bordered text-center w-12 text-black border-2 border-gray-300"
            />
            <span>秒</span>
          </div>
        </label>
      </div>
      <div className="form-control">
        <label className="label text-black">
          <span>表示:</span>
          <select
            value={newIsVisible ? 'true' : 'false'}
            onChange={(e) => setNewIsVisible(e.target.value === 'true')}
            className="select select-bordered text-black border-2 border-gray-300"
          >
            <option value="true">表示する</option>
            <option value="false">表示しない</option>
          </select>
        </label>
      </div>
      <div className="flex justify-end space-x-4">
        <button type="submit" className="btn btn-primary">メモを更新</button>
        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>キャンセル</button>
      </div>
    </form>
  );
};

export default NoteEditor;
