import update from 'immutability-helper';
import { Note } from '../../types/note';
import { CustomUser } from '../../types/user';

export const downloadNotes = (sortedNotes: Note[]) => {
  const noteContent = sortedNotes.map(note => `Content: ${note.content}\nTimestamp: ${note.video_timestamp}`).join('\n\n');
  const blob = new Blob([noteContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'memos.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const moveNote = (
  sortedNotes: Note[],
  setSortedNotes: (notes: Note[]) => void,
  dragIndex: number,
  hoverIndex: number,
  currentUser: CustomUser,
  saveSortOrder: (notes: Note[], videoId: number) => Promise<void>,
  videoId: number
) => {
  const draggedNote = sortedNotes[dragIndex];
  if (draggedNote.user.id !== currentUser.id) {
    return; // 他のユーザーのメモは並び替えできないようにする
  }
  const newSortedNotes = update(sortedNotes, {
    $splice: [
      [dragIndex, 1],
      [hoverIndex, 0, draggedNote],
    ],
  });

  setSortedNotes(newSortedNotes);
  saveSortOrder(newSortedNotes, videoId); // 並び替え後の順序を保存
};

export const saveSortOrder = async (sortedNotes: Note[], videoId: number) => {
  const sortedNoteIds = sortedNotes.map(note => ({ id: note.id }));
  const token = localStorage.getItem('token'); // JWTトークンをローカルストレージから取得

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/${videoId}/notes/save_sort_order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // JWTトークンをヘッダーに追加
      },
      body: JSON.stringify({ sorted_notes: sortedNoteIds }),
    });

    if (!response.ok) {
      throw new Error('順序の保存に失敗しました。');
    }

    console.log('順序が正常に保存されました。');
  } catch (error) {
    console.error('順序の保存中にエラーが発生しました:', error);
  }
};
