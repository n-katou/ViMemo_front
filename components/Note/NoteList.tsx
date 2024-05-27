import React, { useState, useEffect } from 'react';
import NoteItem from './NoteItem'; // NoteItemコンポーネントをインポート
import { Note } from '../../types/note'; // Note型をインポート
import { Swiper, SwiperSlide } from 'swiper/react'; // Swiperコンポーネントをインポート
import 'swiper/css'; // SwiperのCSSをインポート
import 'swiper/css/pagination'; // Swiperのpagination用CSSをインポート
import 'swiper/css/navigation'; // Swiperのnavigation用CSSをインポート
import { Pagination, Navigation } from 'swiper/modules'; // Swiperのモジュールをインポート

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

  useEffect(() => {
    // 画面サイズが変更されたときのハンドラ
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // 画面幅が768px以下の場合はモバイル表示
    };

    handleResize(); // 初期表示時に実行
    window.addEventListener('resize', handleResize); // リサイズイベントを監視
    return () => window.removeEventListener('resize', handleResize); // クリーンアップ
  }, []);

  // メモを作成日時でソートする
  const sortedNotes = [...notes].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div id="notes_list" className="mt-5">
      <h2 className="text-xl font-bold mb-4">メモ一覧</h2>
      {sortedNotes.length > 0 ? ( // メモがある場合
        isMobile ? ( // モバイル表示の場合
          <Swiper
            spaceBetween={10} // スライド間のスペース
            slidesPerView={1} // 1画面に表示するスライド数
            pagination={{ clickable: true }} // ページネーションの設定
            navigation // ナビゲーションの有効化
            modules={[Pagination, Navigation]} // 使用するモジュールの指定
          >
            {sortedNotes.map((note) => {
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
                    onEdit={onEdit} // メモを編集する関数
                    isOwner={isOwner} // メモの所有者かどうか
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        ) : ( // デスクトップ表示の場合
          <div className="flex flex-wrap -mx-2">
            {sortedNotes.map((note) => {
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
                    onEdit={onEdit} // メモを編集する関数
                    isOwner={isOwner} // メモの所有者かどうか
                  />
                </div>
              );
            })}
          </div>
        )
      ) : ( // メモがない場合
        <p id="no_notes_message">メモがありません。</p>
      )}
    </div>
  );
};

export default NoteList;
