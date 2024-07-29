import React from 'react';
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from './api/api';

// Define a type for the props of the wrapped component
type WrappedComponentProps = {
  [key: string]: any;
};

export const withAuth = <P extends WrappedComponentProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  return class extends React.Component<P, { isAuthenticated: boolean; isLoading: boolean }> {
    state = {
      isAuthenticated: false,
      isLoading: true,
    };

    async componentDidMount() {
      const loggedIn = await isLoggedIn();
      this.setState({ isAuthenticated: loggedIn, isLoading: false });
    }

    render() {
      const { isAuthenticated, isLoading } = this.state;

      if (isLoading) {
        return <div>Loading...</div>; // Or your custom loading component
      }

      if (!isAuthenticated) {
        return <Navigate to="/" replace />;
      }

      return <WrappedComponent {...this.props} />;
    }
  };
};