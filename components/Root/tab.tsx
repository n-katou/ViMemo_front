import React from 'react';

const tab = (isLightTheme: boolean) => [
  {
    title: "アカウント管理",
    value: "account_management",
    content: (
      <div className="p-6 text-xl md:text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: isLightTheme ? '#333' : '#f0f8ff' }}>
          アカウント管理
        </h3>
        <p className="text-center" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
          Googleアカウントを利用すれば、登録不要でログインが可能です
        </p>
        <div className="mt-4 flex justify-center">
          <img
            src="https://i.gyazo.com/9f8777682f57eba9472e308144c0ccc2.gif"
            alt="ログイン方法の説明"
            className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
          />
        </div>
      </div>
    ),
  },
  {
    title: "検索機能",
    value: "search",
    content: (
      <div className="p-6 text-xl md:text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: isLightTheme ? '#333' : '#f0f8ff' }}>
          検索機能
        </h3>
        <div className="flex justify-center">
          <p className="text-center font-semibold text-white bg-teal-500 p-3 rounded-lg w-full md:w-auto">
            非会員でも利用可能な機能です
          </p>
        </div>
        <div className="note-container mt-6">
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              タイトルの部分一致で検索可能
            </p>
            <img
              src="https://i.gyazo.com/79f4e2662fa4667c3221350f530fb8a8.gif"
              alt="全件検索"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
          <hr className="border-t border-gray-300 dark:border-gray-600 my-6" />
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              サジェストから選択で動画詳細に遷移
            </p>
            <img
              src="https://i.gyazo.com/bb98f75c7fa57d3a48af8625a30b52b2.gif"
              alt="サジェスト"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
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
      <div className="p-6 text-xl md:text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: isLightTheme ? '#333' : '#f0f8ff' }}>
          メモ操作
        </h3>

        {/* 会員限定の記載 */}
        <div className="flex justify-center mb-6">
          <p className="text-center font-semibold text-white bg-pink-500 p-3 rounded-lg inline-block">
            このセクションは会員限定です (一部除く)
          </p>
        </div>

        {/* 会員専用の機能 */}
        <div className="note-container mt-6">
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              再生中にメモ追加が可能
            </p>
            <img
              src="https://i.gyazo.com/7976fa8f168a82669aff26214fe9d70c.gif"
              alt="メモ作成"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
          <hr className="border-t border-gray-300 dark:border-gray-600 my-6" />
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              再生中にメモ編集が可能
            </p>
            <img
              src="https://i.gyazo.com/a1c63d00c74953b5e27393f7b2611da0.gif"
              alt="メモ編集"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
          <hr className="border-t border-gray-300 dark:border-gray-600 my-6" />
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              メモの移動を、ご自身のメモに限定 (PCのみ)
            </p>
            <img
              src="https://i.gyazo.com/5f2639d40a12aa11b08e69aeb56e353c.gif"
              alt="メモ移動"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
        </div>
        {/* 非会員でも利用可能な機能の記載（中央配置） */}
        <div className="w-full flex justify-center my-6">
          <p className="text-center font-semibold text-white bg-teal-500 p-3 rounded-lg inline-block w-fit">
            非会員でも利用可能な機能です
          </p>
        </div>
        {/* 非会員でも利用可能な機能 */}
        <div className="note-container mt-6">
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              タイムスタンプクリックで、時間軸が移動
            </p>
            <img
              src="https://i.gyazo.com/9aef836642f1cfa60a35f809c098bffb.gif"
              alt="タイムスタンプ"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
          <hr className="border-t border-gray-300 dark:border-gray-600 my-6" />
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              表示しているメモリストでダウンロード可能
            </p>
            <img
              src="https://i.gyazo.com/a63c81ec8f56498300b95970c5b855a1.gif"
              alt="ダウンロード"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
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
      <div className="p-6 text-xl md:text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: isLightTheme ? '#333' : '#f0f8ff' }}>
          動画取得
        </h3>

        {/* 中央配置 */}
        <div className="w-full flex justify-center">
          <p className="text-center font-semibold text-white bg-pink-500 p-3 rounded-lg inline-block w-fit">
            このセクションは会員限定です
          </p>
        </div>

        <div className="mt-6">
          <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
            マイページから1日1回まで取得可能です。無制限利用をご希望の方はお問い合わせください。
          </p>
          <img
            src="https://i.gyazo.com/05ceda3f173adf006c3e34ae2bf92400.gif"
            alt="動画取得方法"
            className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
          />
        </div>
      </div>
    ),
  },
  {
    title: "プレイリスト",
    value: "video_playlist",
    content: (
      <div className="p-6 text-xl md:text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: isLightTheme ? '#333' : '#f0f8ff' }}>
          プレイリスト
        </h3>

        {/* 中央配置 */}
        <div className="w-full flex justify-center">
          <p className="text-center font-semibold text-white bg-pink-500 p-3 rounded-lg inline-block w-fit">
            このセクションは会員限定です
          </p>
        </div>

        <div className="note-container mt-6">
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              いいねした動画でプレイリストを作成し、シャッフル再生も可能です
            </p>
            <img
              src="https://i.gyazo.com/52ed84887624b7f6a45a824c888adf3d.gif"
              alt="プレイリスト"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>いいねした動画の並び替えが可能です (PC推奨)</p>
            <img
              src="https://i.gyazo.com/8a7a554f6b5874980bd2dfe200abc36d.gif"
              alt="プレイリスト並び替え"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "活用方法",
    value: "play",
    content: (
      <div className="p-6 text-xl md:text-2xl bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold mb-4 text-center" style={{ color: isLightTheme ? '#333' : '#f0f8ff' }}>
          活用方法
        </h3>

        {/* 中央配置 */}
        <div className="w-full flex justify-center">
          <p className="text-center font-semibold text-white bg-pink-500 p-3 rounded-lg inline-block w-fit">
            このセクションは会員限定です
          </p>
        </div>

        <div className="note-container mt-6">
          {/* <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              ご自身のメモを使ってX (旧Twitter) にお気に入り場面をシェアできます
            </p>
            <img
              src="https://i.gyazo.com/985d8401bbc0fe3ed4b24206ff2ed83d.gif"
              alt="Xへのシェア"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div> */}
          <div className="mb-6">
            <p className="text-center font-medium" style={{ color: isLightTheme ? '#818cf8' : 'white' }}>
              自分で書いたメモを動画ごとに管理し、一覧から簡単に整理できます
            </p>
            <img
              src="https://i.gyazo.com/946ae5cc9aa7311b6aec0ea25fcb23c0.gif"
              alt="メモの管理"
              className="rounded-lg shadow-lg w-full md:w-3/4 mx-auto"
            />
          </div>
        </div>
      </div>
    ),
  }
];

export default tab;
