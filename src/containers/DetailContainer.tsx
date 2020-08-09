import React from 'react';

import Detail from '../components/Detail';
import useBook from '../hooks/useBook';
import useGo from '../hooks/useGo';
import { useAuth } from '../hooks/useAuth';
import useBookIdParams from '../hooks/useBookIdParams';

const DetailContainer = () => {
  // [project] saga 함수를 실행하는 액션 생성 함수를 실행하는 함수를 컨테이너에 작성했다.
  // [project] 컨테이너에서 useDispatch, useSelector, useCallback 을 활용해서 중복없이 비동기 데이터를 보여주도록 처리했다.
  // [project] Edit 나 Detail 컴포넌트에서 새로고침 시, 리스트가 없는 경우, 리스트를 받아오도록 처리했다.
  const { logout } = useAuth();

  const { goEdit, goBack } = useGo();

  const id = useBookIdParams();

  const book = useBook(id);

  return <Detail book={book} logout={logout} goEdit={goEdit} goBack={goBack} />;
};

export default DetailContainer;
