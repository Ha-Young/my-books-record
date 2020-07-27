export interface BookReqType {
  title: string;
  author: string;
  message: string;
  url: string;
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
