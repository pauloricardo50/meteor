// @flow
import React from 'react';
import moment from 'moment';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import { DASHBOARD_PAGE } from 'imports/startup/client/appRoutes';

type WithLoanStartProps = {};

const WithLoanStart = ({
  anonymousLoan: { _id: loanId, name, updatedAt, borrowers },
}: WithLoanStartProps) => {
  const mostRecentDate = Math.max.apply(null, [
    updatedAt,
    ...borrowers.map(({ updatedAt: u }) => u),
  ]);

  return (
    <div className="card1 card-top with-loan-start">
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

      <Button
        className="cta"
        secondary
        raised
        link
        to={createRoute(DASHBOARD_PAGE, { loanId })}
      >
        <T id="general.continue" />
      </Button>
    </div>
  );
};

export default WithLoanStart;
