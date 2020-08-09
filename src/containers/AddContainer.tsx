import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Add from '../components/Add';
import { BookReqType } from '../types';
import { addBooks } from '../redux/modules/books';
import useGo from '../hooks/useGo';
import { useAuth } from '../hooks/useAuth';

const AddContainer = () => {
  const dispatch = useDispatch();

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  const onSubmitAddBook = useCallback(
    (bookReq: BookReqType) => {
      dispatch(addBooks(bookReq));
    },
    [dispatch],
  );

  const { logout } = useAuth();

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
