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
  const incrementMinutes = () => {
    setNewMinutes(newMinutes + 1);
  };

  const decrementMinutes = () => {
    if (newMinutes > 0) {
      setNewMinutes(newMinutes - 1);
    }
  };

  const incrementSeconds = () => {
    if (newSeconds < 59) {
      setNewSeconds(newSeconds + 1);
    } else {
      setNewSeconds(0);
      setNewMinutes(newMinutes + 1);
    }
  };

  const decrementSeconds = () => {
    if (newSeconds > 0) {
      setNewSeconds(newSeconds - 1);
    } else if (newMinutes > 0) {
      setNewSeconds(59);
      setNewMinutes(newMinutes - 1);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleEdit(); }} className="space-y-4">
      <textarea
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="メモを編集..."
        required
        className="textarea textarea-bordered w-full"
      />
      <div className="form-control">
        <label className="label">
          <span>タイムスタンプ:</span>
          <div className="flex gap-1 items-center flex-wrap">
            <button type="button" onClick={incrementMinutes} className="btn btn-outline btn-sm">+</button>
            <input
              type="number"
              value={newMinutes}
              onChange={(e) => setNewMinutes(parseInt(e.target.value, 10))}
              min="0"
              max="59"
              className="input input-bordered text-center"
              style={{ width: '40px' }}
            />
            <span>分</span>
            <button type="button" onClick={decrementMinutes} className="btn btn-outline btn-sm">-</button>
            <button type="button" onClick={incrementSeconds} className="btn btn-outline btn-sm">+</button>
            <input
              type="number"
              value={newSeconds}
              onChange={(e) => setNewSeconds(parseInt(e.target.value, 10))}
              min="0"
              max="59"
              className="input input-bordered text-center"
              style={{ width: '40px' }}
            />
            <span>秒</span>
            <button type="button" onClick={decrementSeconds} className="btn btn-outline btn-sm">-</button>
          </div>
        </label>
      </div>
      <div className="form-control">
        <label className="label">
          <span>表示:</span>
          <select
            value={newIsVisible ? 'true' : 'false'}
            onChange={(e) => setNewIsVisible(e.target.value === 'true')}
            className="select select-bordered"
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
