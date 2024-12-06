import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <meta name="google-site-verification" content="54KaI2JGliTENx8T3AqO8w6ourYnwQMeiszEmIhWsVM" />
          <link rel="icon" href="/favicon_v2.png" sizes="32x32" />
          <meta name="description" content="ViMemoは、動画視聴中に直感的にメモを追加できるサービスです。" />
          <meta property="og:title" content="ViMemo" />
          <meta property="og:description" content="動画視聴中、直感的にメモを追加できるサービス" />
          <meta property="og:image" content="/og-image.png" />
          <meta property="og:url" content="https://vimemo.vercel.app" />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content="https://vimemo.vercel.app/pinterest_board_photo.png" />
          <link rel="canonical" href="https://vimemo.vercel.app" />
          <link rel="manifest" href="/site.webmanifest" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="ViMemo" />
          <meta name="theme-color" content="#000000" />
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
