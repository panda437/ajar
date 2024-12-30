import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function withAuth(Component) {
  return function AuthenticatedComponent(props) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    if (!user) {
      return null; // Or a loading spinner
    }

    return <Component {...props} />;
  };
}