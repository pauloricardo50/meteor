// @flow
import React from 'react';
import moment from 'moment';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import T, { Money } from 'core/components/Translation';
import { createRoute } from 'core/utils/routerUtils';
import APP_ROUTES from 'imports/startup/client/appRoutes';

type WithLoanStartProps = {};

const WithLoanStart = ({
  anonymousLoan: { _id: loanId, name, updatedAt, borrowers = [], properties },
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
      {properties && properties[0] && (
        <h4 className="secondary">
          {properties[0].name || properties[0].address1}
          &nbsp;-&nbsp;
          <Money value={properties[0].totalValue} />
        </h4>
      )}
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
        to={createRoute(APP_ROUTES.DASHBOARD_PAGE.path, { loanId })}
      >
        <T id="general.continue" />
      </Button>
    </div>
  );
};

export default WithLoanStart;
