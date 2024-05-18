import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 w-full">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
          <Link href="/agreement" legacyBehavior>
            <a className="text-sm hover:text-gray-400 transition">利用規約</a>
          </Link>
          <Link href="/privacy" legacyBehavior>
            <a className="text-sm hover:text-gray-400 transition">プライバシーポリシー</a>
          </Link>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSeQeuzGKun6xQNU5EcZqSS2c8ju1uMWp2dM-AYGqNGY_QBscA/viewform" className="text-sm hover:text-gray-400 transition" target="_blank" rel="noopener noreferrer">
            お問い合わせ
          </a>
        </div>
        <p className="text-sm text-center md:text-right mt-4 md:mt-0">
          Copyright © 2024. ViMemo
        </p>
      </div>
    </footer>
  );
};

export default Footer;
