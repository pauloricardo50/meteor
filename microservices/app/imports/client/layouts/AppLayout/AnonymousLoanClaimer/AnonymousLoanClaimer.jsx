import React, { useState } from 'react';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { assignLoanToUser } from 'core/api/loans/methodDefinitions';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import Dialog from 'core/components/Material/Dialog';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';

import APP_ROUTES from '../../../../startup/client/appRoutes';
import useAnonymousLoan from '../../../hooks/useAnonymousLoan';

const AnonymousLoanClaimer = ({ currentUser }) => {
  const {
    anonymousLoan,
    loading: anonymousLoanLoading,
    setAnonymousLoanId,
  } = useAnonymousLoan({ name: 1, updatedAt: 1, borrowers: { updatedAt: 1 } });
  const history = useHistory();
  const [loading, setLoading] = useState();

  if (anonymousLoanLoading) {
    return null;
  }

  if (!anonymousLoanLoading && !anonymousLoan) {
    return null;
  }

  const { name, updatedAt, borrowers = [] } = anonymousLoan;
  const open = !!anonymousLoan;

  const handleRemove = () => {
    localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
    setAnonymousLoanId(undefined);
  };

  const handleClaim = () => {
    setLoading(true);
    assignLoanToUser
      .run({ loanId: anonymousLoan._id, userId: currentUser._id })
      .then(() => {
        localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
        setAnonymousLoanId(undefined);
        history.push(
          createRoute(APP_ROUTES.DASHBOARD_PAGE.path, {
            loanId: anonymousLoan._id,
          }),
        );
      })
      .finally(() => setLoading(false));
  };

  const mostRecentDate = Math.max.apply(null, [
    updatedAt,
    ...borrowers.map(({ updatedAt: u }) => u),
  ]);

  return (
    <Dialog
      important
      actions={[
        <Button loading={loading} error outlined key="1" onClick={handleRemove}>
          <T id="AnonymousLoanClaimer.refuse" />
        </Button>,
        <Button loading={loading} primary raised key="2" onClick={handleClaim}>
          <T id="AnonymousLoanClaimer.claim" />
        </Button>,
      ]}
      open={open}
      title={<T id="AnonymousLoanClaimer.title" />}
    >
      <div className="with-loan-start">
        <Icon type="dollarSign" className="icon" />
        <h2>
          <T id="AnonymousAppPage.withLoanTitle" values={{ name }} />
        </h2>
        <span className="secondary">
          <T
            id="AnonymousAppPage.lastModifiedAt"
            values={{ date: moment(mostRecentDate).fromNow() }}
          />
        </span>
      </div>
    </Dialog>
  );
};

export default AnonymousLoanClaimer;
