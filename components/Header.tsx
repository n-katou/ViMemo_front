// components/Header.client.jsx
import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-lg font-bold">Vimemo</h1>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/" className="hover:text-gray-300">Home</Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-gray-300">ログインページ</Link>
            </li>
            <li>
              <Link href="/youtube_videos" className="hover:text-gray-300">Youtube</Link>
            </li>
            <li>
              <Link href="/mypage" className="hover:text-gray-300">マイページ</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
