import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Add from '../components/Add';
import { logout as logoutSaga } from '../redux/modules/auth';
import { BookReqType } from '../types';
import { addBooks } from '../redux/modules/books';
import useGo from '../hooks/useGo';

const AddContainer = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const onSubmitAddBook = (bookReq: BookReqType) => {
    dispatch(addBooks(bookReq));
  };

  const { goBack } = useGo();

  return (
    <Add
      loading={false}
      logout={logout}
      onSubmitAddBook={onSubmitAddBook}
      goBack={goBack}
    />
  );
};

export default AddContainer;
