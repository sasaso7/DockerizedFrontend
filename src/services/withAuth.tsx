import { useAuth } from '@/contexts/AuthContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

// Define a type for the props of the wrapped component
type WrappedComponentProps = {
  [key: string]: any;
};

export const withAuth = <P extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return (props: P) => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
      return <Navigate to="/" replace />;
    }

    return <WrappedComponent {...props} />;
  };
};