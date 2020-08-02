import React from 'react';
import { PageHeader, Button, Input } from 'antd';
import { BookOutlined } from '@ant-design/icons';

import Layout from './Layout';
import { BookResType } from '../types';
import styles from './Detail.module.css';

const { TextArea } = Input;

interface DetailProps {
  book: BookResType | null | undefined;
  logout: () => void;
  goEdit: (bookId: number) => void;
  goBack: () => void;
}

// [project] 컨테이너에 작성된 함수를 컴포넌트에서 이용했다.
// [project] BookResType 의 응답 값을 이용하여, Detail 컴포넌트를 완성했다.
const Detail: React.FC<DetailProps> = ({ book, logout, goEdit, goBack }) => {
  console.log('Detail', book);
  if (book == null) {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>NotFound Book</h1>
        <h3>this is incorrect access</h3>
      </div>
    );
  }

  return (
    <Layout>
      <PageHeader
        onBack={goBack}
        title={
          <div>
            <BookOutlined /> {book.title}
          </div>
        }
        subTitle={book.author}
        extra={[
          <Button
            key="2"
            type="primary"
            onClick={onEditClick}
            className={styles.button}
          >
            Edit
          </Button>,
          <Button
            key="1"
            type="primary"
            className={styles.button}
            onClick={logout}
          >
            Logout
          </Button>,
        ]}
      />

      <img src="/bg_list.png" className={styles.bg} alt="books" />

      <div className={styles.detail}>
        <div className={styles.message_title}>My Comment </div>
        <div className={styles.message}>
          <TextArea
            rows={4}
            value={book.message}
            readOnly
            className={styles.message_textarea}
          />
        </div>
        <div className={styles.button_area}></div>
      </div>
    </Layout>
  );

  function onEditClick() {
    if (book && book.bookId) {
      goEdit(book?.bookId);
    }
  }
};
export default Detail;
