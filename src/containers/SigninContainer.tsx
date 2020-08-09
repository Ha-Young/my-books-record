import React from 'react';
import { useSelector } from 'react-redux';

import Signin from '../components/Signin';
import { RootState } from '../redux/modules/rootReducer';
import { useAuth } from '../hooks/useAuth';

const SigninContainer: React.FC = () => {
  const loading = useSelector<RootState, boolean>(
    (state) => state.auth.loading,
  );
  const error = useSelector<RootState, Error | null>(
    (state) => state.auth.error,
  );

  const { login } = useAuth();

  return <Signin loading={loading} error={error} login={login} />;
};

export default SigninContainer;
