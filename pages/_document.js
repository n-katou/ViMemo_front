import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta name="google-site-verification" content="54KaI2JGliTENx8T3AqO8w6ourYnwQMeiszEmIhWsVM" />
          <link rel="icon" href="/favicon.png" />
          <meta name="description" content="ViMemoは、動画視聴中に直感的にメモを追加できるサービスです。" />
          <meta property="og:title" content="ViMemo" />
          <meta property="og:description" content="動画視聴中、直感的にメモを追加できるサービス" />
          <meta property="og:image" content="https://vimemo.s3.ap-northeast-1.amazonaws.com/uploads/pinterest_board_photo.png" />
          <meta property="og:url" content="https://vi-memo.com" />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://vi-memo.com" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-title" content="ViMemo" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
