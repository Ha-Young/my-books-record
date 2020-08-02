import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import List from '../components/List';
import { logout as logoutSaga } from '../redux/modules/auth';
import { RootState } from '../redux/modules/rootReducer';
import { getBooks, removeBooks } from '../redux/modules/books';
import useGo from '../hooks/useGo';

const ListContainer: React.FC = () => {
  const dispatch = useDispatch();
  const logout = useCallback(() => {
    dispatch(logoutSaga());
  }, [dispatch]);

  // Book Component에 전달하기 위한 클릭 리스너
  const { goAdd, goDetail, goEdit } = useGo();

  const removeBook = useCallback(
    (bookId: number) => {
      dispatch(removeBooks(bookId));
    },
    [dispatch],
  );

  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  const { books, loading, error } = useSelector(
    (state: RootState) => state.books,
  );

  useEffect(() => {
    if (books) return;

    dispatch(getBooks());
  }, [dispatch, books]);
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
