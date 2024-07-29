import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface UseSearchFormProps {
  handleSearch: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const useSearchForm = ({ handleSearch }: UseSearchFormProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(false);
    };

    // ルート変更時にローディング状態をリセットするためのイベントリスナーを登録
    router.events.on('routeChangeStart', handleRouteChange);
    router.events.on('routeChangeComplete', handleRouteChange);
    router.events.on('routeChangeError', handleRouteChange);

    // コンポーネントのクリーンアップ時にイベントリスナーを削除
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeError', handleRouteChange);
    };
  }, [router]);

  // フォームの送信イベントを処理する関数
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // フォームのデフォルトの送信動作を防ぐ
    setLoading(true); // ローディング状態をtrueに設定
    await handleSearch(event); // 検索処理を実行
    setLoading(false); // 検索処理が完了したらローディング状態をfalseに設定
  };

  return {
    loading,
    handleFormSubmit,
  };
};

export default useSearchForm;
