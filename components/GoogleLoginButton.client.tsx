const GoogleLoginButton = () => {
  const handleLogin = () => {
    window.location.href = '/api/auth/google'; // 認証ページへのパス
  };

  return (
    <button onClick={handleLogin} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
      Googleでログイン
    </button>
  );
};

export default GoogleLoginButton;
