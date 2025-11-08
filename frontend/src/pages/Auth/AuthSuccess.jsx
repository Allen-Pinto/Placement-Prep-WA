import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/authApi';
import { AUTH_TOKEN_KEY, USER_DATA_KEY } from '../../utils/constants';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      console.log('=== OAuth Callback Started ===');
      
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      
      console.log('Token received:', token ? 'YES' : 'NO');
      console.log('Error:', error || 'None');
      
      if (error) {
        console.error('OAuth error:', error);
        navigate('/login?error=' + error);
        return;
      }

      if (!token) {
        console.error('No token in URL');
        navigate('/login?error=no_token');
        return;
      }

      try {
        console.log('Storing token...');
        
        // Store token in localStorage first
        localStorage.setItem(AUTH_TOKEN_KEY, token);
        
        // Fetch user profile using the token
        console.log('Fetching user profile...');
        const { data, error: profileError } = await authApi.getProfile();
        
        if (data && data.success && data.user) {
          console.log('User profile fetched:', data.user.email);
          
          // Store user data
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(data.user));
          
          // Update auth store using setAuth method
          setAuth(data.user, token);
          
          console.log('Auth state updated, redirecting to dashboard...');
          
          // Small delay to ensure state is updated
          setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 100);
          
        } else {
          console.error('Failed to fetch user profile:', profileError);
          
          // Even if profile fetch fails, store the token and try to proceed
          // The app will try to load user data on next request
          const dummyUser = {
            email: 'user@oauth.com',
            name: 'OAuth User',
          };
          
          localStorage.setItem(USER_DATA_KEY, JSON.stringify(dummyUser));
          setAuth(dummyUser, token);
          
          navigate('/dashboard', { replace: true });
        }
        
      } catch (error) {
        console.error('Error in OAuth callback:', error);
        navigate('/login?error=callback_failed');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        {/* Animated Spinner */}
        <div className="relative inline-flex">
          <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin"></div>
          <div 
            className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-secondary-500 rounded-full animate-spin" 
            style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}
          ></div>
        </div>
        
        {/* Loading Text */}
        <div className="mt-6">
          <p className="text-xl text-dark-text font-medium">
            Completing login...
          </p>
          <p className="mt-2 text-sm text-dark-text-muted">
            Please wait while we set up your account
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccess;