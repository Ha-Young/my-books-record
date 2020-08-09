import { useDispatch } from 'react-redux';
import { goBack as goBackTo, push } from 'connected-react-router';
import { useCallback } from 'react';

type useGoRetType = {
  goBack: () => void;
  goAdd: () => void;
  goEdit: (bookId: number) => void;
  goDetail: (bookId: number) => void;
};

export default function useGo(): useGoRetType {
  const dispatch = useDispatch();

  const goBack = useCallback(() => {
    dispatch(goBackTo());
  }, [dispatch]);

  const goEdit = useCallback(
    (bookId: number) => {
      dispatch(push(`/edit/${bookId}`));
    },
    [dispatch],
  );

  const goAdd = useCallback(() => {
    dispatch(push('/add'));
  }, [dispatch]);

  const goDetail = useCallback(
    (bookId: number) => {
      dispatch(push(`/book/${bookId}`));
    },
    [dispatch],
  );

  return { goBack, goEdit, goAdd, goDetail };
}
