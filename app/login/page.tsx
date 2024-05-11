"use client";
import axios from "axios";
import useFirebaseAuth from '../../hooks/useFirebaseAuth';

const LoginPage = () => {
  const { loginWithGoogle } = useFirebaseAuth();

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        const token = await user.getIdToken();
        const userData = {
          user: {
            name: user.displayName, // Firebaseから提供されるdisplayName
            email: user.email, // Firebaseから提供されるemail
            password: 'test',
            password_confirmation: 'test'
          }
        };

        const config = {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        };

        await axios.post("https://vimemo.fly.dev/api/v1/users", userData, config);
        console.log('User registered successfully');
      }
    } catch (err) {
      let message = "An error occurred during the login process.";
      if (axios.isAxiosError(err) && err.response) {
        console.error('Error:', err.response.data);
      } else {
        console.error(message);
      }
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        <span>Sign in with Google</span>
      </button>
    </div>
  );
}

export default LoginPage;
