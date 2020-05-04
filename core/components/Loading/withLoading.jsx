import React from 'react';
import { branch, renderComponent } from 'recompose';

import Loading from './Loading';

export default (small, disableVar) =>
  branch(
    ({ loading, isLoading, ...props }) =>
      (loading || isLoading) && (!disableVar || !props[disableVar]),
    renderComponent(() => <Loading small={small} />),
  );
