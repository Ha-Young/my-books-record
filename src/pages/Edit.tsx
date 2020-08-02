import React from 'react';
import { Redirect } from 'react-router-dom';

import useToken from '../hooks/useToken';
import EditContainer from '../containers/EditContainer';
import { RouterComponentProps, BookParams } from '../types';

const Edit = ({ match }: RouterComponentProps<BookParams>) => {
  const token = useToken();
  if (token === null) {
    return <Redirect to="/signin" />;
  }
  return <EditContainer id={match.params.id} />;
};

export default Edit;
