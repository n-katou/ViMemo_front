import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useOAuthCallback from '../../hooks/useOAuthCallback';

const OAuthCallbackPage = () => {
  useOAuthCallback();

  return (
    <div>
      <p>ログイン処理中...</p>
    </div>
  );
};

export default OAuthCallbackPage;
