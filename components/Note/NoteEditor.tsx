import React from 'react';

interface NoteEditorProps {
  newContent: string; // 新しいメモの内容
  newMinutes: number; // 新しいタイムスタンプの分
  newSeconds: number; // 新しいタイムスタンプの秒
  newIsVisible: boolean; // メモの表示/非表示の状態
  setNewContent: (content: string) => void; // メモの内容を設定する関数
  setNewMinutes: (minutes: number) => void; // タイムスタンプの分を設定する関数
  setNewSeconds: (seconds: number) => void; // タイムスタンプの秒を設定する関数
  setNewIsVisible: (isVisible: boolean) => void; // メモの表示/非表示を設定する関数
  handleEdit: () => void; // 編集をハンドルする関数
  setIsEditing: (isEditing: boolean) => void; // 編集モードを設定する関数
  padZero: (num: number) => string; // 数字を2桁にパディングする関数
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
      {/* メモの内容を入力するテキストエリア */}
      <span className="text-black">メモ：</span>
      <textarea
        value={newContent}
        onChange={(e) => setNewContent(e.target.value)}
        placeholder="メモを編集..."
        required
        className="textarea textarea-bordered w-full bg-white text-black border border-gray-300 placeholder-black"
      />
      {/* タイムスタンプを入力する部分 */}
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
              className="input input-bordered text-center w-12 bg-white text-black border border-gray-300 placeholder-black"
            />
            <span className="text-black">分</span>
            <input
              type="number"
              value={newSeconds || ''}
              onChange={(e) => setNewSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              min="0"
              max="59"
              placeholder="00"
              className="input input-bordered text-center w-12 bg-white text-black border border-gray-300 placeholder-black"
            />
            <span className="text-black">秒</span>
          </div>
        </label>
      </div>
      {/* メモの表示/非表示を選択する部分 */}
      <div className="form-control">
        <label className="label text-black">
          <span>表示:</span>
          <select
            value={newIsVisible ? 'true' : 'false'}
            onChange={(e) => setNewIsVisible(e.target.value === 'true')}
            className="select select-bordered bg-white text-black border border-gray-300"
          >
            <option value="true">表示する</option>
            <option value="false">表示しない</option>
          </select>
        </label>
      </div>
      {/* フォームの送信とキャンセルボタン */}
      <div className="flex justify-end space-x-4">
        <button type="submit" className="btn btn-primary">メモを更新</button>
        <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>キャンセル</button>
      </div>
    </form>
  );
};

export default NoteEditor;
