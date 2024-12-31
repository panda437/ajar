import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login'); // Redirect to login if not logged in
      }
    }, [user]);

    if (!user) {
      return <p>Loading...</p>;
    }

    return <Component {...props} />;
  };
}

export default withAuth;