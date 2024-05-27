// src/tabs.js
const tabs = [
  {
    title: "アカウント管理",
    value: "account_management",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white' }}>
        <p>Googleアカウントを利用すれば、登録不要でログインが可能です。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/login.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "メモ操作",
    value: "video_and_notes",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white' }}>
        <p>動画再生中にメモを追加し、重要なポイントを記録。後で簡単にアクセスできます。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/sousa.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "検索機能",
    value: "video_search",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white' }}>
        <p>キーワードで動画を検索し、サジェスト機能を利用できます。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/search.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "動画取得",
    value: "video_get",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white' }}>
        <p>マイページから動画を取得できます。取得権限が必要な場合はお問い合わせください。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/get.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "プレイリスト",
    value: "video_playlist",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white' }}>
        <p>いいねした動画でプレイリストを作成し、シャッフル再生が可能です。</p>
        <div className="mt-4">
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
            <video
              src="/video/playlist.mp4"
              autoPlay
              loop
              muted
              controls
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    ),
  },
];

export default tabs;
