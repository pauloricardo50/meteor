import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { PartnerLayout } from '/imports/ui/containers/PartnerContainers';
import PartnerHomePage from '/imports/ui/pages/partner/PartnerHomePage';
import PartnerRequestPage from '/imports/ui/pages/partner/PartnerRequestPage';
import NotFound from '/imports/ui/components/general/NotFound';

const PartnerRoutes = props =>
  (<PartnerLayout
    {...props}
    type="partner"
    render={layoutProps =>
      (<Switch>
        <Route
          exact
          path="/partner"
          render={() => <PartnerHomePage {...layoutProps} />}
        />
        <Route
          exact
          path="/partner/requests/:requestId"
          render={routeProps =>
            <PartnerRequestPage {...layoutProps} {...routeProps} />}
        />
        <Route component={NotFound} />
      </Switch>)}
  />);

export default PartnerRoutes;
