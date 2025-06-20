import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gradient-rainbow text-white py-8 w-full">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        {/* リンク一覧 */}
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          <Link href="/agreement" legacyBehavior>
            <a className="text-sm hover:text-gray-400 transition">利用規約</a>
          </Link>
          <Link href="/privacy" legacyBehavior>
            <a className="text-sm hover:text-gray-400 transition">プライバシーポリシー</a>
          </Link>
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeQeuzGKun6xQNU5EcZqSS2c8ju1uMWp2dM-AYGqNGY_QBscA/viewform"
            className="text-sm hover:text-gray-400 transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            お問い合わせ
          </a>
        </div>

        {/* クレジット */}
        <p className="text-left text-xs text-white">
          © 2024 ViMemo | Created by <span className="font-medium">KatoNaoto</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
