import React from 'react';

const tab = (isLightTheme: boolean) => [
  {
    title: "アカウント管理",
    value: "account_management",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <div className="note-item mt-4" style={{ width: '100%' }}>
            <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              Googleアカウントを利用すれば、登録不要でログインが可能です
            </p>
            <div className="mt-4">
              <img
                src="https://i.gyazo.com/9f8777682f57eba9472e308144c0ccc2.gif"
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
      <div className="p-4 text-xl md:text-2xl" style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{
            color: '#22eec5',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.5rem',
            backgroundColor: isLightTheme ? '#f0f8ff' : '#000',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #22eec5',
            display: 'inline-block',
            marginBottom: '20px' // 適切な余白を追加
          }}>
            非会員でも利用可能な機能です
          </p>
          <div className="note-container" style={{ width: '100%' }}>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                タイトルの部分一致で検索可能です
              </p>
              <img
                src="https://i.gyazo.com/79f4e2662fa4667c3221350f530fb8a8.gif"
                width="100%"
                alt="全件検索"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                サジェストから選択で動画詳細に遷移します
              </p>
              <img
                src="https://i.gyazo.com/bb98f75c7fa57d3a48af8625a30b52b2.gif"
                width="100%"
                alt="サジェスト"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                虫眼鏡にマウスホバーしたら、最新のメモ3件確認できます
              </p>
              <img
                src="https://i.gyazo.com/09a9adb8ea7a2c51e31f83c90e96c42e.gif"
                width="100%"
                alt="サジェスト"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "メモ操作",
    value: "memo",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{
            color: '#e879f9',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.5rem',
            backgroundColor: isLightTheme ? '#f0f8ff' : '#000',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e879f9',
            display: 'inline-block',
            marginBottom: '20px' // 適切な余白を追加
          }}>
            このセクションは会員限定です(一部除く)
          </p>
          <div className="note-container" style={{ width: '100%' }}>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                再生中にメモ追加が可能です
              </p>
              <img
                src="https://i.gyazo.com/7976fa8f168a82669aff26214fe9d70c.gif"
                width="100%"
                alt="メモ作成"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                再生中にメモ編集が可能です
              </p>
              <img
                src="https://i.gyazo.com/a1c63d00c74953b5e27393f7b2611da0.gif"
                width="100%"
                alt="メモ編集"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                メモの移動を、ご自身のメモに限定して可能です（PCのみ）
              </p>
              <img
                src="https://i.gyazo.com/5f2639d40a12aa11b08e69aeb56e353c.gif"
                width="100%"
                alt="メモ移動"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', textAlign: 'center', width: '100%' }}>
              <p style={{
                color: '#22eec5',
                fontWeight: 'bold',
                fontSize: '1.5rem',
                backgroundColor: isLightTheme ? '#f0f8ff' : '#000',
                padding: '10px 20px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                border: '2px solid #22eec5',
                display: 'inline-block',
                marginBottom: '20px' // 適切な余白を追加
              }}>
                非会員でも利用可能な機能です
              </p>
              <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
                <p style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
                  タイムスタンプクリックで、時間軸が移動します
                </p>
                <img
                  src="https://i.gyazo.com/9aef836642f1cfa60a35f809c098bffb.gif"
                  width="100%"
                  alt="タイムスタンプ"
                  style={{ display: 'block', margin: 'auto' }}
                />
              </div>
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                表示しているメモリストでダウンロード可能です
              </p>
              <img
                src="https://i.gyazo.com/a63c81ec8f56498300b95970c5b855a1.gif"
                width="100%"
                alt="ダウンロード"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "動画取得",
    value: "video_get",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{
            color: '#e879f9',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.5rem',
            backgroundColor: isLightTheme ? '#f0f8ff' : '#000',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e879f9',
            display: 'inline-block',
            marginBottom: '20px' // 適切な余白を追加
          }}>
            このセクションは会員限定です
          </p>
          <div className="note-container" style={{ width: '100%' }}>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                マイページから1日1回まで取得可能です取得を無制限にされたい方はお問い合わせ下さい
              </p>
              <img
                src="https://i.gyazo.com/05ceda3f173adf006c3e34ae2bf92400.gif"
                width="100%"
                alt="動画取得方法"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "プレイリスト",
    value: "video_playlist",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{
            color: '#e879f9',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.5rem',
            backgroundColor: isLightTheme ? '#f0f8ff' : '#000',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e879f9',
            display: 'inline-block',
            marginBottom: '20px' // 適切な余白を追加
          }}>
            このセクションは会員限定です
          </p>
          <div className="note-container" style={{ width: '100%' }}>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                いいねした動画でプレイリストを作成しますシャッフル再生も可能です
              </p>
              <img
                src="https://i.gyazo.com/52ed84887624b7f6a45a824c888adf3d.gif"
                width="100%"
                alt="プレイリスト"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                いいねした動画の並び替えが可能です（PC推奨）
              </p>
              <img
                src="https://i.gyazo.com/8a7a554f6b5874980bd2dfe200abc36d.gif"
                width="100%"
                alt="プレイリスト"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "活用方法",
    value: "play",
    content: (
      <div className="p-4 text-xl md:text-2xl" style={{ color: isLightTheme ? '#818cf8' : 'white', textAlign: 'left' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <p style={{
            color: '#e879f9',
            fontWeight: 'bold',
            textAlign: 'center',
            fontSize: '1.5rem',
            backgroundColor: isLightTheme ? '#f0f8ff' : '#000',
            padding: '10px 20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            border: '2px solid #e879f9',
            display: 'inline-block',
            marginBottom: '20px' // 適切な余白を追加
          }}>
            このセクションは会員限定です
          </p>
          <div className="note-container" style={{ width: '100%' }}>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                ご自身のメモに限定して、Xへお気に入り場面のシェアが可能です
              </p>
              <img
                src="https://i.gyazo.com/985d8401bbc0fe3ed4b24206ff2ed83d.gif"
                width="100%"
                alt="シェア"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
            <div className="note-item mt-4" style={{ marginBottom: '20px', width: '100%' }}>
              <p style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
                自分で書いたメモを動画ごとに管理できるため、一覧から簡単に整理することができます
              </p>
              <img
                src="https://i.gyazo.com/946ae5cc9aa7311b6aec0ea25fcb23c0.gif"
                width="100%"
                alt="メモの管理"
                style={{ display: 'block', margin: 'auto' }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export default tab;
