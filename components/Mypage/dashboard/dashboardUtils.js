import axios from 'axios';
import debounce from 'lodash/debounce';

export const fetchData = async (
  jwtToken, currentUser, setAuthState, setYoutubeVideoLikes,
  setNoteLikes, setYoutubePlaylistUrl, setFlashMessageState,
  setShowSnackbar, router
) => {
  // JWTトークンがない場合エラーメッセージを表示
  if (!jwtToken) {
    console.error('Token is undefined');
    return;
  }

  try {
    // APIからデータを取得
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    // レスポンスから必要なデータを解凍
    const { youtube_video_likes, note_likes, youtube_playlist_url, avatar_url, role, email, name } = response.data;

    // sort_orderが有効な動画のみを含むようにフィルタリングし、順序をソート
    const sortedVideoLikes = youtube_video_likes
      .filter(video => video.sort_order !== null && video.sort_order !== undefined)  // sort_orderが無効な場合を除外
      .sort((a, b) => a.sort_order - b.sort_order);  // sort_orderでソート

    // ソートされた動画リストを設定
    setYoutubeVideoLikes(sortedVideoLikes);

    // ノートのいいね情報を設定
    setNoteLikes(note_likes);

    // プレイリストURLを設定
    setYoutubePlaylistUrl(youtube_playlist_url);

    // currentUserが存在する場合にユーザー情報を更新
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar_url, role, email, name };
      if (
        currentUser.avatar_url !== avatar_url ||
        currentUser.role !== role ||
        currentUser.email !== email ||
        currentUser.name !== name
      ) {
        // 認証状態を更新し、ローカルストレージに保存
        setAuthState({ currentUser: updatedUser, jwtToken });
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      }
    }

    // URLクエリにフラッシュメッセージが含まれている場合
    const flashMessageFromQuery = router.query.flashMessage;
    if (flashMessageFromQuery) {
      setFlashMessageState(flashMessageFromQuery);
      setShowSnackbar(true);

      // フラッシュメッセージを消去してURLをクリーンにする
      const { flashMessage, ...rest } = router.query;
      router.replace({ pathname: router.pathname, query: rest }, undefined, { shallow: true });
    }
  } catch (error) {
    // エラーハンドリング
    if (error.response) {
      // APIからのエラーレスポンスがある場合、そのデータを表示
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
    } else {
      // ネットワークエラーやその他のエラーの場合
      console.error('Error message:', error.message);
    }
    // エラーメッセージをユーザーに通知
    setFlashMessageState('データの取得に失敗しました。');
    setShowSnackbar(true);
  }
};


export const fetchVideosByGenre = async (genre, jwtToken, setYoutubeVideos, setFlashMessageState, setShowSnackbar, router) => {
  console.log('Fetching videos with genre:', genre);
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/youtube_videos/fetch_videos_by_genre`, {
      params: { genre },
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    console.log('Response:', response);

    if (response.status === 200) {
      const { youtube_videos_data, newly_created_count } = response.data;
      setYoutubeVideos(youtube_videos_data);
      const flashMessage = `動画を ${newly_created_count} 件取得しました`;

      console.log('Navigating to /youtube_videos with flashMessage:', flashMessage); // デバッグ用のログ
      router.push({
        pathname: '/youtube_videos',
        query: { flashMessage }
      }); // 画面遷移を実行
    }
  } catch (error) {
    let errorMessage = 'ビデオを取得できませんでした。';
    if (axios.isAxiosError(error)) {
      console.error('Error fetching YouTube videos:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
    } else {
      console.error('Unknown error:', error);
      errorMessage = '不明なエラーが発生しました。';
    }
    setFlashMessageState(errorMessage);
    setShowSnackbar(true);
  }
};

export const debouncedFetchSuggestions = debounce(async (query, setSuggestions) => {
  if (!query) return;

  try {
    // YouTube Data APIにGETリクエストを送信してサジェスチョンを取得
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY,
      },
    });

    if (response.status === 200) {
      // レスポンスデータから動画のタイトルを取得し、サジェスチョンとして設定
      const items = response.data.items;
      const titles = items.map((item) => item.snippet.title);
      setSuggestions(titles);
    }
  } catch (error) {
    console.error('Error fetching YouTube suggestions:', error); // エラーハンドリング
  }
}, 1000);

export const shufflePlaylist = async (jwtToken, setYoutubePlaylistUrl, setYoutubeVideoLikes) => {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/generate_shuffle_playlist`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    if (response.status === 200) {
      const { shuffled_youtube_playlist_url, youtube_videos } = response.data;

      setYoutubePlaylistUrl(shuffled_youtube_playlist_url);
      setYoutubeVideoLikes(youtube_videos);

      return youtube_videos; // 修正: シャッフル後の動画リストを返す
    }
  } catch (error) {
    console.error('Error generating shuffled playlist:', error);
    return [];
  }
};


// プレイリストの順序をバックエンドに送信する関数
export const updatePlaylistOrder = async (jwtToken, videos, setYoutubeVideoLikes) => {
  const videoIds = videos.map(video => video.id);

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/update_playlist_order`,
      { video_ids: videoIds },
      {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status === 200) {
      console.log('Playlist order updated successfully:', response.data);

      // 最新のプレイリストを取得
      const latestResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/mypage`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      const { youtube_video_likes } = latestResponse.data;
      setYoutubeVideoLikes(youtube_video_likes);
    }
  } catch (error) {
    console.error('Error updating playlist order:', error.message);
  }
};
