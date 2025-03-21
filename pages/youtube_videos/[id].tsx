import React from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/List/NoteList';
import YoutubeVideoDetails from '../../components/YoutubeShow/YoutubeVideoDetails';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ToggleButtonGroup, Snackbar, Alert } from '@mui/material';
import { useTheme } from 'next-themes';
import { CustomToggleButton, useSnackbarStyles, useAlertStyles } from '../../styles/youtube_videos/YoutubeVideoShowPageStyles';
import { handleLikeVideo, handleUnlikeVideo, handleDeleteNote, handleEditNote, addNote, videoTimestampToSeconds, playFromTimestamp } from '../../components/YoutubeShow/youtubeShowUtils';
import useYoutubeVideoShowPage from '../../hooks/youtube_videos/useYoutubeVideoShowPage';

const YoutubeVideoShowPage: React.FC = () => {
  const {
    video,
    notes,
    likeError,
    liked,
    isNoteFormVisible,
    showMyNotes,
    isSnackbarOpen,
    dataLoading,
    currentUser,
    jwtToken,
    loading,
    playerRef,
    router,
    setVideo,
    setNotes,
    setLiked,
    setLikeError,
    setIsNoteFormVisible,
    setShowMyNotes,
    handleSnackbarClose,
    filteredNotes,
  } = useYoutubeVideoShowPage();

  const { theme } = useTheme();
  const snackbarStyles = useSnackbarStyles();
  const alertStyles = useAlertStyles();

  if (loading || dataLoading) {
    return <LoadingSpinner loading={loading || dataLoading} />;
  }

  return (
    <div className={`container mx-auto py-8 mt-2 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={snackbarStyles}
      >
        <Alert onClose={handleSnackbarClose} severity="info" sx={alertStyles}>
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
              {isNoteFormVisible && (
                <NoteForm
                  addNote={(content, minutes, seconds, isVisible) => addNote(content, minutes, seconds, isVisible, jwtToken, video, setNotes)}
                  player={playerRef.current}
                  onCancel={() => setIsNoteFormVisible(false)} // キャンセル時に投稿フォームを閉じる
                />
              )}
            </div>
          )}
          {currentUser && (
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
