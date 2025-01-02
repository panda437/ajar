import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push('/login'); // Redirect if not logged in
      }
    }, [loading, user]);

    if (loading) {
      return <p>Loading...</p>; // Show a loader while checking auth
    }

    if (!user) {
      return null; // Prevent rendering until redirect happens
    }

    return <Component {...props} />;
  };
}