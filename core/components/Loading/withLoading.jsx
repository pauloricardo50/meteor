import React from 'react';
import { branch, renderComponent } from 'recompose';
import Loading from './Loading';

export default small =>
  branch(
    ({ loading, isLoading }) => loading || isLoading,
    renderComponent(() => <Loading small={small} />),
  );
