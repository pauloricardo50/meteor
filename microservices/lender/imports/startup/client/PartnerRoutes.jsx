import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PartnerLayout } from 'core/containers/PartnerContainers';
import PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage';
import PartnerLoanPage from '/imports/ui/pages/partner/PartnerLoanPage';
import NotFound from '/imports/ui/components/NotFound';

const PartnerRoutes = props => (
  <PartnerLayout
    {...props}
    type="partner"
    render={layoutProps => (
      <Switch>
        <Route
          exact
          path="/partner"
          render={() => <PartnerHomePage {...layoutProps} />}
        />
        <Route
          exact
          path="/partner/loans/:loanId"
          render={routeProps => (
            <PartnerLoanPage {...layoutProps} {...routeProps} />
          )}
        />
        <Route component={NotFound} />
      </Switch>
    )}
  />
);

export default PartnerRoutes;
