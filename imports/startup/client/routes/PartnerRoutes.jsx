import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PartnerLayout } from '/imports/ui/containers/PartnerContainers';
import PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage.jsx';
import PartnerRequestPage from '/imports/ui/pages/partner/PartnerRequestPage.jsx';

const PartnerRoutes = props => (
  <PartnerLayout
    {...props}
    type="partner"
    render={layoutProps => (
      <Switch>
        <Route exact path="/partner" render={() => <PartnerHomePage {...layoutProps} />} />
        <Route
          exact
          path="/partner/requests/:requestId"
          render={routeProps => <PartnerRequestPage {...layoutProps} {...routeProps} />}
        />
      </Switch>
    )}
  />
);

export default PartnerRoutes;
