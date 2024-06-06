import React, { useState, useEffect } from 'react';
import NoteItem from './NoteItem'; // NoteItemコンポーネントをインポート
import { Note } from '../../types/note'; // Note型をインポート
import { Swiper, SwiperSlide } from 'swiper/react'; // Swiperコンポーネントをインポート
import 'swiper/css'; // SwiperのCSSをインポート
import 'swiper/css/pagination'; // Swiperのpagination用CSSをインポート
import 'swiper/css/navigation'; // Swiperのnavigation用CSSをインポート
import { Pagination, Navigation } from 'swiper/modules'; // Swiperのモジュールをインポート
import PaginationComponent from '../Pagination'; // ページネーションコンポーネントをインポート
import Modal from './Modal'; // モーダルコンポーネントをインポート
import NoteEditor from './NoteEditor'; // NoteEditor コンポーネントをインポート

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
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの表示/非表示の状態
  const [editNote, setEditNote] = useState<Note | null>(null); // 編集するメモの状態
  const itemsPerPage = 6; // 1ページあたりのメモの数

  useEffect(() => {
    // 画面サイズが変更されたときのハンドラ
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 画面幅が768px以下の場合はモバイル表示
    };

    handleResize(); // 初期表示時に実行
    window.addEventListener('resize', handleResize); // リサイズイベントを監視
    return () => window.removeEventListener('resize', handleResize); // クリーンアップ
  }, []);

  const handleEditClick = (note: Note) => {
    setEditNote(note);
    setIsModalOpen(true);
  };

  const handleEditSubmit = (noteId: number, newContent: string, newMinutes: number, newSeconds: number, newIsVisible: boolean) => {
    if (onEdit) {
      onEdit(noteId, newContent, newMinutes, newSeconds, newIsVisible);
    }
    setIsModalOpen(false);
    setEditNote(null);
  };

  // メモを作成日時でソートする
  const sortedNotes = [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // ページネーションのためのメモのスライス
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = sortedNotes.slice(startIndex, endIndex);

  return (
    <div id="notes_list" className="mt-5">
      <h2 className="text-xl font-bold mb-4">メモ一覧</h2>
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
              {paginatedNotes.map((note) => {
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
              {paginatedNotes.map((note) => {
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
            setNewMinutes={(value) => setEditNote(prev => prev ? { ...prev, newMinutes: value } : prev)}
            setNewSeconds={(value) => setEditNote(prev => prev ? { ...prev, newSeconds: value } : prev)}
            setNewIsVisible={(value) => setEditNote(prev => prev ? { ...prev, newIsVisible: value } : prev)}
            handleEdit={() => handleEditSubmit(editNote.id, editNote.content, Math.floor(videoTimestampToSeconds(editNote.video_timestamp) / 60), videoTimestampToSeconds(editNote.video_timestamp) % 60, editNote.is_visible)}
            setIsEditing={(value) => setIsModalOpen(value)}
            padZero={(num) => num.toString().padStart(2, '0')}
          />
        </Modal>
      )}
    </div>
  );
};

export default NoteList;
