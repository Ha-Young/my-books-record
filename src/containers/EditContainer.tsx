import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Edit from '../components/Edit';
import { logout as logoutSaga } from '../redux/modules/auth';
import { BookParams, BookEditReqType } from '../types';
import useBook from '../hooks/useBook';
import { editBooks } from '../redux/modules/books';
import useGo from '../hooks/useGo';

const EditContainer = ({ id }: BookParams) => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const book = useBook(parseInt(id));
  const updateBook = (editBook: BookEditReqType) => {
    dispatch(editBooks(editBook));
  };

  const { goBack } = useGo();

  return (
    <Edit book={book} logout={logout} updateBook={updateBook} goBack={goBack} />
  );
};

export default EditContainer;
