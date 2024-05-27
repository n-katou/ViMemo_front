import axios from 'axios';
import debounce from 'lodash/debounce';

// お気に入りデータをフェッチする関数
export const fetchData = async (jwtToken, currentUser, setAuthState, setYoutubeVideoLikes, setNoteLikes, setYoutubePlaylistUrl, setFlashMessageState, setShowSnackbar, router) => {
  if (!jwtToken) {
    console.error('Token is undefined');
    return;
  }

  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    const { youtube_video_likes, note_likes, youtube_playlist_url, avatar_url, role, email, name } = response.data;
    setYoutubeVideoLikes(youtube_video_likes);
    setNoteLikes(note_likes);
    setYoutubePlaylistUrl(youtube_playlist_url);

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        avatar_url,
        role,
        email,
        name,
      };

      if (
        currentUser.avatar_url !== avatar_url ||
        currentUser.role !== role ||
        currentUser.email !== email ||
        currentUser.name !== name
      ) {
        setAuthState({
          currentUser: updatedUser,
          jwtToken,
        });
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }

    const flashMessageFromQuery = router.query.flashMessage;
    if (flashMessageFromQuery) {
      setFlashMessageState(flashMessageFromQuery);
      setShowSnackbar(true);
      const { flashMessage, ...rest } = router.query;
      router.replace({
        pathname: router.pathname,
        query: rest,
      }, undefined, { shallow: true });
    }
  } catch (error) {
    console.error('Error fetching mypage data:', error);
  }
};

// ジャンル別に動画をフェッチする関数
export const fetchVideosByGenre = async (genre, jwtToken, setYoutubeVideos, router) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/fetch_videos_by_genre`, {
      params: { genre },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.status === 200) {
      const { youtube_videos_data, newly_created_count } = response.data;
      console.log('Fetched videos:', youtube_videos_data); // デバッグ用のログ
      setYoutubeVideos(youtube_videos_data);
      const flashMessage = `動画を ${newly_created_count} 件取得しました`;

      console.log('Navigating to /youtube_videos with flashMessage:', flashMessage); // デバッグ用のログ
      router.push({
        pathname: '/youtube_videos',
        query: { flashMessage }
      });
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching YouTube videos:', error.response?.data || error.message);
    } else {
      console.error('Unknown error:', error);
    }
  }
};

// YouTube検索のサジェスチョンをデバウンスしてフェッチする関数
export const debouncedFetchSuggestions = debounce(async (query, setSuggestions) => {
  if (!query) return;

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      },
    });

    if (response.status === 200) {
      const items = response.data.items;
      const titles = items.map((item) => item.snippet.title);
      setSuggestions(titles);
    }
  } catch (error) {
    console.error('Error fetching YouTube suggestions:', error);
  }
}, 1000);

// シャッフルプレイリストを生成する関数
export const shufflePlaylist = async (jwtToken, setYoutubePlaylistUrl) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/generate_shuffle_playlist`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.status === 200) {
      const { shuffled_youtube_playlist_url } = response.data;
      setYoutubePlaylistUrl(shuffled_youtube_playlist_url);
    }
  } catch (error) {
    console.error('Error generating shuffled playlist:', error);
  }
};
