import { BookResType } from '../../types';
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';
import BookService from '../../services/BookService';

// Action
const BOOKS_REQUEST = 'my-books/books/BOOKS_REQUEST' as const;
const BOOKS_SUCCESS = 'my-books/books/BOOKS_SUCCESS' as const;
const BOOKS_FAILURE = 'my-books/books/BOOKS_FAILURE' as const;

export const getBooksAsync = createAsyncAction(
  BOOKS_REQUEST,
  BOOKS_SUCCESS,
  BOOKS_FAILURE,
)<string, BookResType[], AxiosError>();

// Reducer
export interface BooksState {
  books: BookResType[] | null;
  loading: boolean;
  error: Error | null;
}

const initialState: BooksState = {
  books: null,
  loading: false,
  error: null,
};

type BooksAction = ActionType<typeof getBooksAsync>;

const getBooksReducer = createReducer<BooksState, BooksAction>(initialState, {
  [BOOKS_REQUEST]: (state) => ({
    ...state,
    loading: true,
    books: null,
    error: null,
  }),
  [BOOKS_SUCCESS]: (state, action) => ({
    ...state,
    loading: false,
    books: action.payload,
    error: null,
  }),
  [BOOKS_FAILURE]: (state, action) => ({
    ...state,
    loading: false,
    books: null,
    error: action.payload,
  }),
});

// SAGA
function* getBooksSaga(action: ReturnType<typeof getBooksAsync.request>) {
  try {
    console.log(action);
    const books: BookResType[] = yield call(
      BookService.getBooks,
      action.payload,
    );
    console.log(books);
    yield put(getBooksAsync.success(books));
  } catch (e) {
    yield put(getBooksAsync.failure(e));
  }
}

export function* sagas() {
  yield takeEvery(BOOKS_REQUEST, getBooksSaga);
}

export default getBooksReducer;
