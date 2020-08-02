import * as H from 'history';
import { match } from 'react-router-dom';

export interface BookReqType {
  title: string;
  author: string;
  message: string;
  url: string;
}

export interface BookEditReqType {
  bookId: number;
  bookReq: BookReqType;
}

// [project] API 응답을 확인하여, BookResType 을 정의한다.
export interface BookResType {
  author: string;
  bookId: number;
  createdAt: Date;
  deletedAt: null;
  message: string;
  ownerId: string;
  title: string;
  updatedAt: Date;
  url: string;
}

export interface LoginReqType {
  email: string;
  password: string;
}

export interface LoginResType {
  token: string;
}

export interface RouterComponentProps<P> {
  match: match<P>;
  location: H.Location;
  history: H.History;
  staticContext?: any;
}

export interface BookParams {
  id: string;
}
