import React, { useEffect, useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { YoutubeVideo } from '../../types/youtubeVideo';
import { Note } from '../../types/note';
import { useAuth } from '../../context/AuthContext';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/List/NoteList';
import YoutubeVideoDetails from '../../components/YoutubeShow/YoutubeVideoDetails';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { fetchYoutubeVideo } from '../../src/api';
import { addNote, handleDeleteNote, handleEditNote, handleLikeVideo, handleUnlikeVideo, videoTimestampToSeconds, playFromTimestamp, formatDuration } from '../../components/YoutubeShow/youtubeShowUtils';
import { ToggleButton, ToggleButtonGroup, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from 'next-themes';

const CustomToggleButton = styled(ToggleButton)(({ theme }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';

  return {
    backgroundColor: isDarkMode ? '#1f2937' : '#e5e7eb', // 非選択時の背景色
    color: isDarkMode ? '#e5e7eb' : '#1f2937', // 非選択時のテキスト色
    '&.Mui-selected': {
      backgroundColor: isDarkMode ? '#6366f1' : '#818cf8',
      color: 'white',
      '&:hover': {
        backgroundColor: isDarkMode ? '#818cf8' : '#6366f1',
      },
    },
    '&:hover': {
      backgroundColor: isDarkMode ? '#2d3748' : '#d1d5db',
    },
  };
});

const YoutubeVideoShowPage: React.FC = () => {
  const [video, setVideo] = useState<YoutubeVideo & { formattedDuration?: string } | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [isNoteFormVisible, setIsNoteFormVisible] = useState<boolean>(false);
  const [showMyNotes, setShowMyNotes] = useState<boolean>(false); // デフォルトをfalseに設定
  const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(true); // フラッシュメッセージの状態管理

  const pathname = usePathname();
  const router = useRouter();

  const { currentUser, jwtToken, loading } = useAuth();
  const { theme } = useTheme(); // テーマフックを使用
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = () => {
      if (!pathname) {
        return;
      }

      const pathSegments = pathname.split('/');
      const videoId = parseInt(pathSegments[pathSegments.length - 1], 10);

      if (!isNaN(videoId)) {
        fetchYoutubeVideo(videoId, jwtToken)
          .then(videoData => {
            setVideo({ ...videoData.youtube_video, formattedDuration: formatDuration(videoData.youtube_video.duration) });
            setNotes(videoData.notes);

            const likes = videoData.youtube_video.likes || [];
            setLiked(likes.some((like: any) => like.user_id === Number(currentUser?.id)));
          })
          .catch(error => {
            console.error('Error loading the video:', error);
            setVideo(null);
          })
          .finally(() => {
            setDataLoading(false);
          });
      } else {
        console.error('Invalid videoId');
        setDataLoading(false);
      }
    };

    fetchData();
  }, [pathname, jwtToken, currentUser, showMyNotes]);

  if (loading || dataLoading) {
    return <LoadingSpinner loading={loading || dataLoading} />;
  }

  const handleSnackbarClose = () => {
    setIsSnackbarOpen(false);
  };

  const filteredNotes = showMyNotes
    ? notes.filter(note => note.user.id === currentUser?.id)
    : notes;

  return (
    <div className={`container mx-auto py-8 mt-2 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={5000} // 5秒後に自動で閉じる
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // 上部中央に表示
        sx={{
          top: '20px',
          width: '90%',
          maxWidth: '600px',
          left: '50%',
          transform: 'translateX(-50%)',
          p: 2, // パディングを追加
          '@media (max-width: 600px)': {
            width: '90%',
            fontSize: '0.875rem',
            padding: '8px', // モバイルでのパディングを追加
          }
        }} // 画面上部に少しスペースを確保し、レスポンシブ対応
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={{
          width: '100%',
          fontSize: '1rem',
          fontWeight: 'bold',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          '@media (max-width: 600px)': {
            fontSize: '0.875rem' // モバイルでのフォントサイズを調整
          }
        }}>
          動画を再生してからメモを作成、編集してください。
        </Alert>
      </Snackbar>
      {!video && <div className="text-center">Video not found</div>}
      {video && (
        <>
          <div className="mb-8 sticky-video">
            <YoutubeVideoDetails
              video={video as YoutubeVideo & { formattedDuration: string }}
              handleLike={currentUser && jwtToken ? () => handleLikeVideo(video, jwtToken, setVideo, setLiked, setLikeError, currentUser) : undefined}
              handleUnlike={currentUser && jwtToken ? () => handleUnlikeVideo(video, jwtToken, setVideo, setLiked, setLikeError, currentUser) : undefined}
              currentUser={currentUser}
              liked={liked}
              onPlayerReady={(player) => (playerRef.current = player)}
            />
            {likeError && <div className="text-red-500 text-center mt-4">{likeError}</div>}
          </div>
          {currentUser && jwtToken && (
            <div className="mb-8">
              <button
                onClick={() => setIsNoteFormVisible(!isNoteFormVisible)}
                className="btn btn-primary mb-4 flex items-center"
              >
                {isNoteFormVisible ? <><CloseIcon className="mr-2" />投稿フォームを閉じる</> : <><AddIcon className="mr-2" />投稿フォームを開く</>}
              </button>
              {isNoteFormVisible && <NoteForm addNote={(content, minutes, seconds, isVisible) => addNote(content, minutes, seconds, isVisible, jwtToken, video, setNotes)} player={playerRef.current} />}
            </div>
          )}
          {currentUser && ( // ログインしている場合にのみ表示
            <div className="mb-8 rounded-md">
              <ToggleButtonGroup
                value={showMyNotes ? 'myNotes' : 'allNotes'}
                exclusive
                onChange={() => setShowMyNotes(!showMyNotes)}
                aria-label="メモの表示切替"
              >
                <CustomToggleButton value="allNotes" aria-label="全てのメモ">
                  全てのメモを表示
                </CustomToggleButton>
                <CustomToggleButton value="myNotes" aria-label="自分のメモ">
                  自分のメモのみ表示
                </CustomToggleButton>
              </ToggleButtonGroup>
            </div>
          )}
          <NoteList
            notes={filteredNotes}
            currentUser={currentUser}
            videoTimestampToSeconds={videoTimestampToSeconds}
            playFromTimestamp={(seconds) => playFromTimestamp(seconds, playerRef)}
            videoId={video.id}
            onDelete={currentUser && jwtToken ? (noteId) => handleDeleteNote(noteId, jwtToken, video, setNotes) : undefined}
            onEdit={currentUser && jwtToken ? (noteId, newContent, newMinutes, newSeconds, newIsVisible) => handleEditNote(noteId, newContent, newMinutes, newSeconds, newIsVisible, jwtToken, video, setNotes) : undefined}
            player={playerRef.current}
          />
          <div className="text-left mt-8">
            <button
              className="btn btn-outline btn-lightperple border rounded-md"
              onClick={() => router.back()}
            >
              戻る
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default YoutubeVideoShowPage;
