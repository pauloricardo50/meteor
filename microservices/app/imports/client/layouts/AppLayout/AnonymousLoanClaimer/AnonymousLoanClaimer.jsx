//
import React from 'react';
import moment from 'moment';
import { withProps, compose, withState } from 'recompose';
import { withRouter } from 'react-router-dom';

import Dialog from 'core/components/Material/Dialog';
import Button from 'core/components/Button';
import T from 'core/components/Translation';
import Icon from 'core/components/Icon';
import { LOCAL_STORAGE_ANONYMOUS_LOAN } from 'core/api/loans/loanConstants';
import { assignLoanToUser } from 'core/api/methods/index';
import { createRoute } from 'core/utils/routerUtils';
import APP_ROUTES from 'imports/startup/client/appRoutes';
import { withAnonymousLoan } from '../../../pages/AppPage/AnonymousAppPage/AnonymousAppPageContainer';

const AnonymousLoanClaimer = ({
  anonymousLoan: { _id: loanId, name, updatedAt, borrowers = [] } = {},
  open,
  loading,
  claimLoan,
  removeAnonymousLoan,
}) => {
  const mostRecentDate = Math.max.apply(null, [
    updatedAt,
    ...borrowers.map(({ updatedAt: u }) => u),
  ]);

  return (
    <Dialog
      important
      actions={[
        <Button
          loading={loading}
          error
          outlined
          key="1"
          onClick={removeAnonymousLoan}
        >
          <T id="AnonymousLoanClaimer.refuse" />
        </Button>,
        <Button loading={loading} primary raised key="2" onClick={claimLoan}>
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

export default compose(
  withAnonymousLoan,
  withRouter,
  withState('loading', 'setLoading', false),
  withProps(
    ({
      anonymousLoan,
      setAnonymousLoanId,
      currentUser,
      setLoading,
      history,
    }) => ({
      open: !!anonymousLoan,
      claimLoan: () => {
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
      },
      removeAnonymousLoan: () => {
        localStorage.removeItem(LOCAL_STORAGE_ANONYMOUS_LOAN);
        setAnonymousLoanId(undefined);
      },
    }),
  ),
)(AnonymousLoanClaimer);
