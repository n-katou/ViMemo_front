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
}) => (
  <div>
    <div className="form-control mb-4">
      <label className="label">
        <span>タイムスタンプ:</span>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            value={padZero(newMinutes)}
            onChange={(e) => setNewMinutes(parseInt(e.target.value, 10))}
            min="0"
            max="59"
            className="input input-bordered"
          />
          分
          <input
            type="number"
            value={padZero(newSeconds)}
            onChange={(e) => setNewSeconds(parseInt(e.target.value, 10))}
            min="0"
            max="59"
            className="input input-bordered"
          />
          秒
        </div>
      </label>
    </div>
    <div className="form-control mb-4">
      <label className="label">メモ</label>
      <textarea
        className="textarea textarea-bordered"
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
      />
    </div>
    <div className="form-control mb-4">
      <label className="label">表示</label>
      <select
        value={newIsVisible ? 'true' : 'false'}
        onChange={(e) => setNewIsVisible(e.target.value === 'true')}
        className="select select-bordered"
      >
        <option value="true">表示する</option>
        <option value="false">表示しない</option>
      </select>
    </div>
    <button onClick={handleEdit} className="btn btn-outline btn-success">保存</button>
    <button onClick={() => setIsEditing(false)} className="btn btn-outline btn-secondary">キャンセル</button>
  </div>
);

export default NoteEditor;
