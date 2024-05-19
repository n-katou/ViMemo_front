import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleLogout = () => {
    if (window.confirm('本当にログアウトしますか？')) {
      logout();
    }
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query) {
      router.push(`/youtube_videos?query=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Vimemo</h1>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/" className="hover:text-gray-300">Home</Link>
            </li>
            {currentUser ? (
              <>
                <li>
                  <Link href="/youtube_videos" className="hover:text-gray-300">Youtube</Link>
                </li>
                <li>
                  <Link href="/mypage" className="hover:text-gray-300">マイページ</Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="hover:text-gray-300">ログアウト</button>
                </li>
              </>
            ) : (
              <li>
                <Link href="/login" className="hover:text-gray-300">ログインページ</Link>
              </li>
            )}
          </ul>
          {currentUser && (
            <form onSubmit={handleSearch} className="flex items-center ml-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="動画タイトルを検索"
                className="border p-2 mr-2 bg-white text-black" // 背景色を白、テキスト色を黒に設定
              />
              <button type="submit" className="btn btn-primary">検索</button>
            </form>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
