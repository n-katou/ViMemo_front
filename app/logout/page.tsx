import dynamic from 'next/dynamic';

// componentsフォルダ内のClientOnlyHomeコンポーネントを正しくインポートする
const ClientOnlyHome = dynamic(() => import('../../components/logout'), {
  ssr: false // サーバーサイドレンダリングを無効にする
});

export default function Home() {
  return <ClientOnlyHome />;
}
