import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';
import DetailContainer from '../containers/DetailContainer';
import { RouterComponentProps, BookParams } from '../types';

const Detail = ({ match }: RouterComponentProps<BookParams>) => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <DetailContainer id={match.params.id} />;
};

export default Detail;
