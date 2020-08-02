import { BookResType, BookReqType, BookEditReqType } from '../../types';
import {
  createAsyncAction,
  createReducer,
  ActionType,
  createAction,
} from 'typesafe-actions';
import { AxiosError } from 'axios';
import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import BookService from '../../services/BookService';
import { getTokenFromState } from '../utils';
import { push } from 'connected-react-router';

//////////////////////////////////// Action ////////////////////////////////////
const BOOKS_GETLIST = 'my-books/books/BOOKS_REQUEST' as const; // 책 목록 가져오기 Action Type
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
    [BOOKS_GETLIST]: (state) => ({
      ...state,
      loading: true,
      books: null,
      error: null,
    }),
    [BOOKS_ADD]: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [BOOKS_EDIT]: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
    [BOOKS_REMOVE]: (state, action) => ({
      ...state,
      loading: true,
      error: null,
    }),
  },
);

//////////////////////////////////// SAGA ////////////////////////////////////
function* getBooksSaga(action: ReturnType<typeof getBooksAsync.request>) {
  try {
    yield put(BOOKS_PENDING);
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
