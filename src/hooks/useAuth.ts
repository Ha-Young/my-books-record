import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { logout as logoutSaga } from '../redux/modules/auth';
import { login as loginSaga } from '../redux/modules/auth';
import { LoginReqType } from '../types';

type useAuthRetType = {
  login: ({ email, password }: LoginReqType) => void;
  logout: () => void;
};

export function useAuth(): useAuthRetType {
  const dispatch = useDispatch();

  const login = useCallback(
    ({ email, password }: LoginReqType) => {
      dispatch(loginSaga({ email, password }));
    },
    [dispatch],
  );

  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  return { login, logout };
}
