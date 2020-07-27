import { BookResType, BookReqType } from '../../types';
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import BookService from '../../services/BookService';
import { getTokenFromState } from '../utils';
import { push } from 'connected-react-router';

// Action

// 책 목록 가져오기 Action Type
const BOOKS_REQUEST = 'my-books/books/BOOKS_REQUEST' as const;
const BOOKS_SUCCESS = 'my-books/books/BOOKS_SUCCESS' as const;
const BOOKS_FAILURE = 'my-books/books/BOOKS_FAILURE' as const;

// 책 추가하기 Action Type
const BOOK_ADD = 'my-books/books/BOOK_ADD' as const;
const BOOK_ADD_SUCCESS = 'my-books/books/BOOK_ADD_SUCCESS' as const;
const BOOK_ADD_FAILURE = 'my-books/books/BOOK_ADD_FAILURE' as const;

// 책 가져오기 Action Creator
export const getBooksAsync = createAsyncAction(
  BOOKS_REQUEST,
  BOOKS_SUCCESS,
  BOOKS_FAILURE,
)<string, BookResType[], AxiosError>();

// 책 추가하기 Action Creator
export const addBookAsync = createAsyncAction(
  BOOK_ADD,
  BOOK_ADD_SUCCESS,
  BOOK_ADD_FAILURE,
)<BookReqType, undefined, AxiosError>();

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

type GETBooksAction =
  | ActionType<typeof getBooksAsync>
  | ActionType<typeof addBookAsync>;

const getBooksReducer = createReducer<BooksState, GETBooksAction>(
  initialState,
  {
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
    [BOOK_ADD]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [BOOK_ADD_SUCCESS]: (state) => ({
      ...state,
      loading: false,
      error: null,
    }),
    [BOOK_ADD_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
);

// SAGA
function* getBooksSaga(action: ReturnType<typeof getBooksAsync.request>) {
  try {
    console.log('getBooksSaga', action);
    const books: BookResType[] = yield call(
      BookService.getBooks,
      action.payload,
    );
    console.log('getBooks : ', books);
    yield put(getBooksAsync.success(books));
  } catch (e) {
    yield put(getBooksAsync.failure(e));
  }
}

function* addBookSaga(action: ReturnType<typeof addBookAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    console.log('addBookSaga', action, token);
    const book: BookResType = yield call(
      BookService.addBook,
      token,
      action.payload,
    );
    console.log('addBook :', book);
    yield put(addBookAsync.success());
    yield put(push('/'));
  } catch (e) {
    yield put(addBookAsync.failure(e));
  }
}

export function* sagas() {
  yield takeEvery(BOOKS_REQUEST, getBooksSaga);
  yield takeLatest(BOOK_ADD, addBookSaga);
}

export default getBooksReducer;
