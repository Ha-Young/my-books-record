import React from 'react';

import styles from './Book.module.css';
import classNames from 'classnames/bind'; // 여러개의 css 클래스 적용시키기 위해서 사용
import { BookResType } from '../types';
import {
  BookOutlined,
  HomeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Tooltip } from 'antd';
import { formatDate } from '../common';

interface BookProps {
  bookResType: BookResType;
  goDetail: (bookId: number) => void;
  goEdit: (bookId: number) => void;
  removeBook: (bookId: number) => void;
}

const cx = classNames.bind(styles);

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Book 컴포넌트를 완성했다.
const Book: React.FC<BookProps> = (bookProps) => {
  const bookId = bookProps.bookResType.bookId;

  return (
    <div className={cx('book')}>
      <h5
        className={cx('title', 'link_detail_title')}
        onClick={() => bookProps.goDetail(bookId)}
      >
        <BookOutlined /> {bookProps.bookResType.title}
      </h5>
      <span
        className={cx('author', 'link_detail_author')}
        onClick={() => bookProps.goDetail(bookId)}
      >
        {bookProps.bookResType.author}
      </span>
      <span className={cx('created')}>
        {formatDate(bookProps.bookResType.createdAt)}
      </span>
      <div className={cx('tooltips')}>
        <Tooltip title={bookProps.bookResType.url}>
          <HomeOutlined
            className={cx('button_url')}
            onClick={() => bookProps.goDetail(bookId)}
          />
        </Tooltip>
        <Tooltip title="Edit">
          <EditOutlined
            className={cx('button_edit')}
            onClick={() => bookProps.goEdit(bookId)}
          />
        </Tooltip>
        <Tooltip title="Delete">
          <DeleteOutlined
            className={cx('button_remove')}
            onClick={() => bookProps.removeBook(bookId)}
          />
        </Tooltip>
      </div>
    </div>
  );
};

export default Book;
