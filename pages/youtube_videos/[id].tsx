import { useEffect, useState } from 'react';
import { YoutubeVideo } from '../../types/youtubeVideo';
import NoteForm from '../../components/Note/NoteForm';
import NoteList from '../../components/Note/List/NoteList';
import YoutubeVideoDetails from '../../components/YoutubeShow/YoutubeVideoDetails';
import LoadingSpinner from '../../components/LoadingSpinner';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { ToggleButtonGroup } from '@mui/material';
import { useTheme } from 'next-themes';
import { CustomToggleButton } from '../../styles/youtube_videos/YoutubeVideoShowPageStyles';
import { handleLikeVideo, handleUnlikeVideo, handleDeleteNote, handleEditNote, addNote, videoTimestampToSeconds, playFromTimestamp } from '../../components/YoutubeShow/youtubeShowUtils';
import useYoutubeVideoShowPage from '../../hooks/youtube_videos/show/useYoutubeVideoShowPage';
import HorizontalVideoShelf from '../../components/HorizontalVideoShelf';
import {
  handleLikeVideo as handleLikeVideoSimple,
  handleUnlikeVideo as handleUnlikeVideoSimple
} from '../../components/YoutubeIndex/youtubeIndexUtils'; //空の情報
import { isMatch, tokenize } from '../../components/YoutubeShow/searchMatchUtils';
import { fetchYoutubeVideos } from '../../components/YoutubeIndex/youtubeIndexUtils';

const YoutubeVideoShowPage: React.FC = () => {
  const {
    video,
    notes,
    likeError,
    liked,
    isNoteFormVisible,
    showMyNotes,
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
    filteredNotes,
  } = useYoutubeVideoShowPage();

  const { theme } = useTheme();
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeVideo[]>([]);

  const [relatedVideos, setRelatedVideos] = useState<YoutubeVideo[]>([]);

  // 関連動画を取得する際の fetch 処理（sortなし・ページング外す）
  useEffect(() => {
    const fetch = async () => {
      const result = await fetchYoutubeVideos('', 1, 1000, ''); // ← sortなし、全件取得
      if (result) {
        setYoutubeVideos(result.videos);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    if (!video) return;

    const keywords = tokenize(video.title).slice(0, 2); // 最大2つまで
    console.log('抽出されたキーワード:', keywords);

    const filtered = youtubeVideos.filter((v) => {
      if (v.id === video.id) return false;
      return keywords.some((kw) => isMatch(v, kw));
    });

    setRelatedVideos(filtered);
    console.log('候補:', filtered.map((v) => v.title));
  }, [video, youtubeVideos]);

  if (loading || dataLoading) {
    return <LoadingSpinner loading={loading || dataLoading} />;
  }

  return (
    <div className={`container mx-auto py-8 mt-2 ${theme === 'light' ? 'text-[#818cf8]' : 'text-white'}`}>
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
          {filteredNotes.length === 0 && (
            <div className="my-12" />
          )}
          {relatedVideos.length > 0 ? (
            <HorizontalVideoShelf
              title="関連動画"
              videos={relatedVideos}
              notes={notes}
              jwtToken={jwtToken}
              setNotes={setNotes}
              onClickTitle={(id) => router.push(`/youtube_videos/${id}`)}
              onLike={(id) =>
                jwtToken && currentUser
                  ? handleLikeVideoSimple(id, jwtToken, currentUser, () => { })
                  : Promise.resolve()
              }
              onUnlike={(id, likeId) =>
                jwtToken && currentUser
                  ? handleUnlikeVideoSimple(id, likeId, jwtToken, currentUser, () => { })
                  : Promise.resolve()
              }
              setVideos={() => { }}
              showLikeButton={false}
              showSearchIcon={false}
            />
          ) : (
            <div className="text-center text-gray-400 mt-12">関連動画はありません</div>
          )}
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
