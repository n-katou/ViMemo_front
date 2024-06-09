import React, { useState, useEffect, useCallback } from 'react';
import NoteItem from './NoteItem'; // NoteItemコンポーネントをインポート
import { Note } from '../../types/note'; // Note型をインポート
import { Swiper, SwiperSlide } from 'swiper/react'; // Swiperコンポーネントをインポーネート
import 'swiper/css'; // SwiperのCSSをインポーネート
import 'swiper/css/pagination'; // Swiperのpagination用CSSをインポーネート
import 'swiper/css/navigation'; // Swiperのnavigation用CSSをインポーネート
import { Pagination, Navigation } from 'swiper/modules'; // Swiperのモジュールをインポーネート
import PaginationComponent from '../Pagination'; // ページネーションコンポーネントをインポーネート
import Modal from './Modal'; // モーダルコンポーネントをインポーネート
import NoteEditor from './NoteEditor'; // NoteEditor コンポーネーネート
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';

interface NoteListProps {
  notes: Note[]; // メモの配列
  currentUser: any; // 現在のユーザー情報
  videoTimestampToSeconds: (timestamp: string) => number; // タイムスタンプを秒に変換する関数
  playFromTimestamp: (seconds: number) => void; // 指定の秒数から再生を開始する関数
  videoId: number; // 動画のID
  onDelete?: (noteId: number) => void; // メモを削除する関数（オプション）
  onEdit?: (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => void; // メモを編集する関数（オプション）
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  currentUser,
  videoTimestampToSeconds,
  playFromTimestamp,
  videoId,
  onDelete,
  onEdit,
}) => {
  const [isMobile, setIsMobile] = useState(false); // モバイル表示かどうかの状態を管理
  const [currentPage, setCurrentPage] = useState(1); // 現在のページを管理
  const [itemsPerPage, setItemsPerPage] = useState(9); // 1ページあたりのメモの数を管理
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示/非表示の状態
  const [editNote, setEditNote] = useState<Note | null>(null); // 編集するメモの状態
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // ソート順序の状態を管理
  const [sortedNotes, setSortedNotes] = useState<Note[]>([]); // ソートされたメモの配列

  useEffect(() => {
    // 画面サイズが変更されたときのハンドラ
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 画面幅が768px以下の場合はモバイル表示
    };

    handleResize(); // 初期表示時に実行
    window.addEventListener('resize', handleResize); // リサイズイベントを監視
    return () => window.removeEventListener('resize', handleResize); // クリーンアップ
  }, []);

  useEffect(() => {
    // 並び替えられたノートをセットする
    const sorted = [...notes].sort((a, b) => a.sort_order - b.sort_order);
    setSortedNotes(sorted);
  }, [notes]);

  const handleEditClick = (note: Note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleEditSubmit = (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => {
    if (onEdit && editNote) {
      onEdit(noteId, newContent, newMinutes, newSeconds, newIsVisible);
    }
    setIsModalOpen(false);
    setEditNote(null);
  };

  // ページネーションのためのメモのスライス
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = sortedNotes.slice(startIndex, endIndex);

  const downloadNotes = () => {
    const sortedForDownload = [...notes].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return dateA - dateB; // 常に古い順にソート
    });

    const noteContent = sortedForDownload.map(note => `Content: ${note.content}\nTimestamp: ${note.video_timestamp}`).join('\n\n');
    const blob = new Blob([noteContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'notes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // ノートを移動する関数
  const moveNote = (dragIndex: number, hoverIndex: number) => {
    const draggedNote = sortedNotes[dragIndex];
    const newSortedNotes = update(sortedNotes, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, draggedNote],
      ],
    });

    setSortedNotes(newSortedNotes);
    saveSortOrder(newSortedNotes); // 並び替え後の順序を保存
  };

  const saveSortOrder = async (sortedNotes: Note[]) => {
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

  return (
    <DndProvider backend={HTML5Backend}>
      <div id="notes_list" className="mt-5">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 space-y-2 md:space-y-0 md:space-x-4">
          <h2 className="text-xl font-bold mb-2 md:mb-0">メモ一覧</h2>
          <div className="flex flex-col md:flex-row items中心">
            <div className="flex items-center">
              <label htmlFor="sortOrder" className="mr-2">並び替え:</label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="p-2 border rounded-md"
              >
                <option value="desc">新しい順</option>
                <option value="asc">古い順</option>
              </select>
            </div>
            <div className="flex items中心">
              <label htmlFor="itemsPerPage" className="mr-2">表示件数:</label>
              <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="p-2 border rounded-md"
              >
                <option value={6}>6件</option>
                <option value={9}>9件</option>
                <option value={12}>12件</option>
                <option value={15}>15件</option>
              </select>
            </div>
            <button onClick={downloadNotes} className="px-4 py-2 btn-outline btn-skyblue border rounded-md">ダウンロード</button>
          </div>
        </div>
        {sortedNotes.length > 0 ? ( // メモがある場合
          isMobile ? ( // モバイル表示の場合
            <>
              <Swiper
                spaceBetween={10} // スライド間のスペース
                slidesPerView={1} // 1画面に表示するスライド数
                pagination={{ clickable: true }} // ページネーションの設定
                navigation // ナビゲーションの有効化
                modules={[Pagination, Navigation]} // 使用するモジュールの指定
              >
                {paginatedNotes.map((note, index) => {
                  const isOwner = currentUser?.id === note.user?.id; // 現在のユーザーがメモの所有者かどうかを判定
                  return (
                    <SwiperSlide key={note.id}>
                      <NoteItem
                        note={note} // メモの情報
                        currentUser={currentUser} // 現在のユーザー情報
                        videoTimestampToSeconds={videoTimestampToSeconds} // タイムスタンプを秒に変換する関数
                        playFromTimestamp={playFromTimestamp} // 指定の秒数から再生を開始する関数
                        videoId={videoId} // 動画のID
                        onDelete={onDelete} // メモを削除する関数
                        onEditClick={handleEditClick} // 編集クリック時の関数
                        isOwner={isOwner} // メモの所有者かどうか
                        index={index} // メモのインデックス
                        moveNote={moveNote} // ノートを移動する関数
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <PaginationComponent
                count={Math.ceil(sortedNotes.length / itemsPerPage)} // 総ページ数を計算
                page={currentPage} // 現在のページ
                onChange={(event, value) => setCurrentPage(value)} // ページ変更時の処理
              />
            </>
          ) : ( // デスクトップ表示の場合
            <div>
              <div className="flex flex-wrap -mx-2">
                {paginatedNotes.map((note, index) => {
                  const isOwner = currentUser?.id === note.user?.id; // 現在のユーザーがメモの所有者かどうかを判定
                  return (
                    <div key={note.id} className="p-2 w-full sm:w-1/2 lg:w-1/3">
                      <NoteItem
                        note={note} // メモの情報
                        currentUser={currentUser} // 現在のユーザー情報
                        videoTimestampToSeconds={videoTimestampToSeconds} // タイムスタンプを秒に変換する関数
                        playFromTimestamp={playFromTimestamp} // 指定の秒数から再生を開始する関数
                        videoId={videoId} // 動画のID
                        onDelete={onDelete} // メモを削除する関数
                        onEditClick={handleEditClick} // 編集クリック時の関数
                        isOwner={isOwner} // メモの所有者かどうか
                        index={index} // メモのインデックス
                        moveNote={moveNote} // ノートを移動する関数
                      />
                    </div>
                  );
                })}
              </div>
              <PaginationComponent
                count={Math.ceil(sortedNotes.length / itemsPerPage)} // 総ページ数を計算
                page={currentPage} // 現在のページ
                onChange={(event, value) => setCurrentPage(value)} // ページ変更時の処理
              />
            </div>
          )
        ) : ( // メモがない場合
          <p id="no_notes_message">メモがありません。</p>
        )}
        {editNote && (
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <NoteEditor
              newContent={editNote.content}
              newMinutes={Math.floor(videoTimestampToSeconds(editNote.video_timestamp) / 60)}
              newSeconds={videoTimestampToSeconds(editNote.video_timestamp) % 60}
              newIsVisible={editNote.is_visible}
              setNewContent={(value) => setEditNote(prev => prev ? { ...prev, content: value } : prev)}
              setNewMinutes={(value) => setEditNote(prev => prev ? { ...prev, video_timestamp: `${value}:${editNote.video_timestamp.split(':')[1]}` } : prev)}
              setNewSeconds={(value) => setEditNote(prev => prev ? { ...prev, video_timestamp: `${editNote.video_timestamp.split(':')[0]}:${value}` } : prev)}
              setNewIsVisible={(value) => setEditNote(prev => prev ? { ...prev, is_visible: value } : prev)}
              handleEdit={() => handleEditSubmit(editNote.id, editNote.content, Math.floor(videoTimestampToSeconds(editNote.video_timestamp) / 60), videoTimestampToSeconds(editNote.video_timestamp) % 60, editNote.is_visible)}
              setIsEditing={(value) => setIsModalOpen(value)}
              padZero={(num) => num.toString().padStart(2, '0')}
            />
          </Modal>
        )}
      </div>
    </DndProvider>
  );
};

export default NoteList;
