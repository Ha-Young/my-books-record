import {
  createAsyncAction,
  createReducer,
  ActionType,
  createAction,
} from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { BookResType, BookReqType, BookEditReqType } from '../../types';
import BookService from '../../services/BookService';
import { getTokenFromState, getBooksFromState } from '../utils';

//////////////////////////////////// Action ////////////////////////////////////
const BOOKS_GETLIST = 'my-books/books/BOOKS_GETLIST' as const; // 책 목록 가져오기 Action Type
const BOOKS_ADD = 'my-books/books/BOOK_ADD' as const; // 책 추가하기 Action Type
const BOOKS_EDIT = 'my-books/books/BOOK_EDIT' as const; // 책 수정하기 Action Type
const BOOKS_REMOVE = 'my-books/books/BOOK_REMOVE' as const; // 책 삭제하기 Action Type

const BOOKS_PENDING = 'my-books/books/BOOKS_PENDING' as const;
const BOOKS_SUCCESS = 'my-books/books/BOOKS_SUCCESS' as const;
const BOOKS_FAILURE = 'my-books/books/BOOKS_FAILURE' as const;

// AsyncAction Creator
export const booksAsync = createAsyncAction(
  BOOKS_PENDING,
  BOOKS_SUCCESS,
  BOOKS_FAILURE,
)<undefined, BookResType[], AxiosError>();

export const getBooks = createAction(BOOKS_GETLIST)(); // 책 가져오기 Action Creator

export const addBooks = createAction(
  BOOKS_ADD,
  (addBook: BookReqType) => addBook,
)(); // 책 추가하기 Action Creator

export const editBooks = createAction(
  BOOKS_EDIT,
  (editBook: BookEditReqType) => editBook,
)(); // 책 수정하기 Action Creator

export const removeBooks = createAction(
  BOOKS_REMOVE,
  (removeBookId: number) => removeBookId,
)(); // 책 삭제하기 Action Creator

//////////////////////////////////// Reducer ////////////////////////////////////
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

const actions = { getBooks, addBooks, editBooks, removeBooks };
type GETBooksAction =
  | ActionType<typeof booksAsync>
  | ActionType<typeof actions>;

const getBooksReducer = createReducer<BooksState, GETBooksAction>(
  initialState,
  {
    [BOOKS_PENDING]: (state) => ({
      ...state,
      loading: true,
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
  },
);

//////////////////////////////////// SAGA ////////////////////////////////////
function* getBooksSaga(action: ReturnType<typeof getBooks>) {
  try {
    yield put(booksAsync.request());
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    const books: BookResType[] = yield call(BookService.getBooks, token);
    yield put(booksAsync.success(books));
  } catch (e) {
    yield put(booksAsync.failure(e));
  }
}

function* addBookSaga(action: ReturnType<typeof addBooks>) {
  try {
    yield put(booksAsync.request());
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    const books: BookResType[] = yield select(getBooksFromState); // books 값을 가져온다.
    const addBook: BookResType = yield call(
      BookService.addBook,
      token,
      action.payload,
    );
    const addedBooks = books.concat(addBook);
    yield put(booksAsync.success(addedBooks));
    yield put(push('/'));
  } catch (e) {
    yield put(booksAsync.failure(e));
  }
}

function* editBookSaga(action: ReturnType<typeof editBooks>) {
  try {
    yield put(booksAsync.request());
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    const books: BookResType[] = yield select(getBooksFromState); // books 값을 가져온다.
    const editBook: BookResType = yield call(
      BookService.editBook,
      token,
      action.payload.bookId,
      action.payload.bookReq,
    );
    const editedBooks = books.map((book) =>
      book.bookId === editBook.bookId ? editBook : book,
    );
    yield put(booksAsync.success(editedBooks));
    yield put(push('/'));
  } catch (e) {
    yield put(booksAsync.failure(e));
  }
}

function* removeBookSaga(action: ReturnType<typeof removeBooks>) {
  try {
    yield put(booksAsync.request());
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    const books: BookResType[] = yield select(getBooksFromState); // books 값을 가져온다.
    const deleteId = action.payload;
    yield call(BookService.deleteBook, token, deleteId);
    const removedBooks = books.filter((book) => book.bookId !== deleteId);
    yield put(booksAsync.success(removedBooks));
    yield put(push('/'));
  } catch (e) {
    yield put(booksAsync.failure(e));
  }
}

export function* sagas() {
  yield takeEvery(getBooks, getBooksSaga);
  yield takeLatest(addBooks, addBookSaga);
  yield takeLatest(editBooks, editBookSaga);
  yield takeLatest(removeBooks, removeBookSaga);
}

export default getBooksReducer;
