// @flow
import React from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometer } from '@fortawesome/pro-light-svg-icons/faTachometer';

import Button from 'core/components/Button';
import T from 'core/components/Translation';

type ReturnToDashboardProps = {};

export const getPathToDashboard = (currentPath: string): string => {
  const splittedPath = currentPath.split('/');
  return `/${[splittedPath[1], splittedPath[2]].join('/')}`;
};

const ReturnToDashboard = ({ history }: ReturnToDashboardProps) => (
  <Button
    onClick={() => history.push(getPathToDashboard(history.location.pathname))}
    raised
    primary
    className="return-to-dashboard"
    icon={<FontAwesomeIcon icon={faTachometer} />}
  >
    <T id="ReturnToDashboard.label" />
  </Button>
);

export default withRouter(ReturnToDashboard);
