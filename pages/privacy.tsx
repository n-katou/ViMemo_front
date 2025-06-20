// pages/privacy.js
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">プライバシーポリシー</h1>
      <div className="space-y-6">
        {/* お客様から取得する情報 */}
        <div className="p-4">
          <h2 className="font-semibold text-xl">お客様から取得する情報</h2>
          <ul className="list-disc pl-5">
            <li>氏名(ニックネームやペンネームも含む)</li>
            <li>メールアドレス</li>
            <li>写真や動画</li>
            <li>外部サービスでお客様が利用するID</li>
            <li>外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報</li>
            <li>Cookie(クッキー)を用いて生成された識別情報</li>
          </ul>
        </div>
        {/* お客様の情報を利用する目的 */}
        <div className="p-4">
          <h2 className="font-semibold text-xl">お客様の情報を利用する目的</h2>
          <ul className="list-disc pl-5">
            <li>サービスに関する登録の受付、お客様の本人確認、認証のため</li>
            <li>お客様の当社サービスの利用履歴を管理するため</li>
            <li>お客様からのお問い合わせに対応するため</li>
            <li>規約や法令に違反する行為に対応するため</li>
            <li>お客様からのお問い合わせに対応するため</li>
          </ul>
        </div>
        {/* 第三者提供 */}
        <div className="p-4">
          <h2 className="font-semibold text-xl">第三者提供</h2>
          <p>個人データについては、お客様の同意なく第三者に提供しません。ただし、以下の例外があります：</p>
          <ul className="list-disc pl-5">
            <li>個人データの取扱いを外部に委託する場合</li>
            <li>事業パートナーと共同利用する場合</li>
            <li>法律によって第三者提供が許されている場合</li>
          </ul>
        </div>
        {/* プライバシーポリシーの変更 */}
        <div className="p-4">
          <h2 className="font-semibold text-xl">プライバシーポリシーの変更</h2>
          <p>必要に応じて、プライバシーポリシーを変更します。変更後のプライバシーポリシーは、効力発生前に適切な方法で周知または通知します。</p>
        </div>
        <p>2024年04月30日 制定</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
