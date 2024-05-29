// src/tabs.js
const tab = [
  {
    title: "アカウント管理",
    value: "account_management",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white', textAlign: 'left' }}>
        <div className="note-container">
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>Googleアカウントを利用すれば、登録不要でログインが可能です。</p>
            <div className="mt-4">
              <img
                src="https://i.gyazo.com/b9226792089d148f0b1dcc659786d536.gif"
                width="100%"
                alt="ログイン方法の説明"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "検索機能",
    value: "search",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white', textAlign: 'left' }}>
        <p style={{ color: '#22eec5', fontWeight: 'bold', textAlign: 'center' }}>非会員でも利用可能な機能です</p>
        <div className="note-container">
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>タイトルの部分一致で検索可能です。</p>
            <img
              src="https://i.gyazo.com/79f4e2662fa4667c3221350f530fb8a8.gif"
              width="100%"
              alt="全件検索"
              style={{ display: 'block', margin: 'auto' }}
            />
          </div>
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>サジェストから選択したら動画詳細に遷移します。</p>
            <img
              src="https://i.gyazo.com/bb98f75c7fa57d3a48af8625a30b52b2.gif"
              width="100%"
              alt="サジェスト"
              style={{ display: 'block', margin: 'auto' }}
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "メモ操作",
    value: "memo",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white', textAlign: 'left' }}>
        <p style={{ color: 'yellow', fontWeight: 'bold', textAlign: 'center' }}>このセクションは会員限定です(一部除く)</p>
        <div className="note-container">
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>再生中にメモ追加が可能です。</p>
            <img
              src="https://i.gyazo.com/7976fa8f168a82669aff26214fe9d70c.gif"
              width="100%"
              alt="メモ作成"
              style={{ display: 'block', margin: 'auto' }}
            />
          </div>
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>再生中にメモ編集が可能です。</p>
            <img
              src="https://i.gyazo.com/a1c63d00c74953b5e27393f7b2611da0.gif"
              width="100%"
              alt="メモ編集"
              style={{ display: 'block', margin: 'auto' }}
            />
          </div>
          <div className="note-item mt-4">
            <p style={{ color: '#22eec5', fontWeight: 'bold', textAlign: 'center', marginBottom: '30px' }}>非会員でも利用可能な機能です</p>
            <p style={{ marginBottom: '30px' }}>タイムスタンプクリックで、時間軸が移動します。</p>
            <img
              src="https://i.gyazo.com/9aef836642f1cfa60a35f809c098bffb.gif"
              width="100%"
              alt="タイムスタンプ"
              style={{ display: 'block', margin: 'auto' }}
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
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white', textAlign: 'left' }}>
        <p style={{ color: 'yellow', fontWeight: 'bold', textAlign: 'center' }}>このセクションは会員限定です</p>
        <div className="note-container">
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>マイページから動画取得可能です。取得権限が必要な方はお問い合わせ下さい。</p>
            <img
              src="https://i.gyazo.com/05ceda3f173adf006c3e34ae2bf92400.gif"
              width="100%"
              alt="動画取得方法"
              style={{ display: 'block', margin: 'auto' }}
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
      <div className="p-4 text-xl md:text-2xl" style={{ color: 'white', textAlign: 'left' }}>
        <p style={{ color: 'yellow', fontWeight: 'bold', textAlign: 'center' }}>このセクションは会員限定です</p>
        <div className="note-container">
          <div className="note-item mt-4">
            <p style={{ marginBottom: '30px' }}>いいねした動画でプレイリストを作成します。シャッフル再生も可能です。</p>
            <img
              src="https://i.gyazo.com/52ed84887624b7f6a45a824c888adf3d.gif"
              width="100%"
              alt="プレイリスト"
              style={{ display: 'block', margin: 'auto' }}
            />
          </div>
        </div>
      </div>
    ),
  },
];

export default tab;
