import { BookResType, BookReqType, BookEditReqType } from '../../types';
import { createAsyncAction, createReducer, ActionType } from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import BookService from '../../services/BookService';
import { getTokenFromState } from '../utils';
import { push } from 'connected-react-router';

//////////////////////////////////// Action ////////////////////////////////////
// 책 목록 가져오기 Action Type
const BOOKS_REQUEST = 'my-books/books/BOOKS_REQUEST' as const;
const BOOKS_SUCCESS = 'my-books/books/BOOKS_SUCCESS' as const;
const BOOKS_FAILURE = 'my-books/books/BOOKS_FAILURE' as const;

// 책 추가하기 Action Type
const BOOK_ADD = 'my-books/books/BOOK_ADD' as const;
const BOOK_ADD_SUCCESS = 'my-books/books/BOOK_ADD_SUCCESS' as const;
const BOOK_ADD_FAILURE = 'my-books/books/BOOK_ADD_FAILURE' as const;

// 책 가져오기 Action Type
const BOOK_EDIT = 'my-books/books/BOOK_EDIT' as const;
const BOOK_EDIT_SUCCESS = 'my-books/books/BOOK_EDIT_SUCCESS' as const;
const BOOK_EDIT_FAILURE = 'my-books/books/BOOK_EDIT_FAILURE' as const;

const BOOK_REMOVE = 'my-books/books/BOOK_REMOVE' as const;
const BOOK_REMOVE_SUCCESS = 'my-books/books/BOOK_REMOVE_SUCCESS' as const;
const BOOK_REMOVE_FAILURE = 'my-books/books/BOOK_REMOVE_FAILURE' as const;

// 책 가져오기 Action Creator
export const getBooksAsync = createAsyncAction(
  BOOKS_REQUEST,
  BOOKS_SUCCESS,
  BOOKS_FAILURE,
)<undefined, BookResType[], AxiosError>();

// 책 추가하기 Action Creator
export const addBookAsync = createAsyncAction(
  BOOK_ADD,
  BOOK_ADD_SUCCESS,
  BOOK_ADD_FAILURE,
)<BookReqType, BookResType, AxiosError>();

// 책 수정하기 Action Creator
export const editBookAsync = createAsyncAction(
  BOOK_EDIT,
  BOOK_EDIT_SUCCESS,
  BOOK_EDIT_FAILURE,
)<BookEditReqType, BookResType, AxiosError>();

// 책 삭제하기 Action Creator
export const removeBookAsync = createAsyncAction(
  BOOK_REMOVE,
  BOOK_REMOVE_SUCCESS,
  BOOK_REMOVE_FAILURE,
)<number, number, AxiosError>();

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

type GETBooksAction =
  | ActionType<typeof getBooksAsync>
  | ActionType<typeof addBookAsync>
  | ActionType<typeof editBookAsync>
  | ActionType<typeof removeBookAsync>;

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
    [BOOK_ADD_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      books:
        state.books && action.payload
          ? state.books.concat(action.payload)
          : state.books,
      error: null,
    }),
    [BOOK_ADD_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [BOOK_EDIT]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [BOOK_EDIT_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      books:
        state.books && action.payload
          ? state.books.map((book) =>
              book.bookId === action.payload.bookId ? action.payload : book,
            )
          : state.books,
      error: null,
    }),
    [BOOK_EDIT_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
    [BOOK_REMOVE]: (state) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [BOOK_REMOVE_SUCCESS]: (state, action) => ({
      ...state,
      loading: false,
      books:
        state.books && action.payload
          ? state.books.filter((book) => book.bookId !== action.payload)
          : state.books,
      error: null,
    }),
    [BOOK_REMOVE_FAILURE]: (state, action) => ({
      ...state,
      loading: false,
      error: action.payload,
    }),
  },
);

//////////////////////////////////// SAGA ////////////////////////////////////
function* getBooksSaga(action: ReturnType<typeof getBooksAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    console.log('getBooksSaga', action, token);
    const books: BookResType[] = yield call(BookService.getBooks, token);
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
    yield put(addBookAsync.success(book));
    yield put(push('/'));
  } catch (e) {
    yield put(addBookAsync.failure(e));
  }
}

function* editBookSaga(action: ReturnType<typeof editBookAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState); // token 값을 가져온다.
    console.log('editBookSaga', action, token);
    const book: BookResType = yield call(
      BookService.editBook,
      token,
      action.payload.bookId,
      action.payload.bookReq,
    );
    console.log('editBook :', book);
    yield put(editBookAsync.success(book));
    yield put(push('/'));
  } catch (e) {
    yield put(editBookAsync.failure(e));
  }
}

function* removeBookSaga(action: ReturnType<typeof removeBookAsync.request>) {
  try {
    const token: string = yield select(getTokenFromState);
    console.log('removeBookSaga', action, token);
    const deleteId = action.payload;
    yield call(BookService.deleteBook, token, deleteId);
    yield put(removeBookAsync.success(deleteId));
    yield put(push('/'));
  } catch (e) {
    yield put(removeBookAsync.failure(e));
  }
}

export function* sagas() {
  yield takeEvery(BOOKS_REQUEST, getBooksSaga);
  yield takeLatest(BOOK_ADD, addBookSaga);
  yield takeLatest(BOOK_EDIT, editBookSaga);
  yield takeLatest(BOOK_REMOVE, removeBookSaga);
}

export default getBooksReducer;
