import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { push } from 'connected-react-router';
import { RootState } from '../redux/modules/rootReducer';
import { getBooksAsync } from '../redux/modules/books';
import useToken from '../hooks/useToken';

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // Book Component에 전달하기 위한 클릭 리스너
  const goDetail = useCallback(
    (bookId: number) => {
      console.log('goDetail');
      dispatch(push(`/book/${bookId}`));
    },
    [dispatch],
  );
  const goEdit = useCallback(
    (bookId: number) => {
      console.log('goEdit');
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );
  const removeBook = useCallback(
    (bookId: number) => {
      console.log('removeBook');
      // dispatch(removeAction);
    },
    [dispatch],
  );

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  const { books, loading, error } = useSelector(
    (state: RootState) => state.books,
  );
  const token = useToken();

  useEffect(() => {
    console.log('ListContainer load');
    console.log('token', token);
    if (books) return;
    if (token) dispatch(getBooksAsync.request());
  }, [dispatch, token, books]);
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.

  return (
    <>
      {error ? (
        <p style={{ textAlign: 'center' }}>애러발생!</p>
      ) : (
        <List
          books={books}
          loading={loading}
          goAdd={goAdd}
          logout={logout}
          goDetail={goDetail}
          goEdit={goEdit}
          removeBook={removeBook}
        />
      )}
    </>
  );
};

export default ListContainer;
