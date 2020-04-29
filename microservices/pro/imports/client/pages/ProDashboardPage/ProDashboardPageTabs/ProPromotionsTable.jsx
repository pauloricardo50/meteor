import React from 'react';
import { compose } from 'recompose';

import { PromotionsTable } from 'core/components/PromotionsTable/PromotionsTable';
import PromotionsTableContainer from 'core/components/PromotionsTable/PromotionsTableContainer';
import T from 'core/components/Translation';

export default compose(PromotionsTableContainer, Component => props => (
  <>
    <h3 className="text-center">
      <T id="ProDashboardPage.promotions" />
    </h3>
    <Component {...props} />
  </>
))(PromotionsTable);
