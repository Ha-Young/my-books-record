import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Detail from '../components/Detail';
import { logout as logoutSaga } from '../redux/modules/auth';
import { BookParams } from '../types';
import { RootState } from '../redux/modules/rootReducer';
import { push } from 'connected-react-router';

const DetailContainer = ({ id }: BookParams) => {
  console.log('Detail Container', id);

  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const goEdit = useCallback(
    (bookId: number) => {
      console.log('goEdit');
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );

  const books = useSelector((state: RootState) => state.books.books);
  console.log('Detail Container...use Selector books', books);
  const book = books?.find((book) => book.bookId === parseInt(id));
  return <Detail book={book} logout={logout} goEdit={goEdit} />;
};

export default DetailContainer;
