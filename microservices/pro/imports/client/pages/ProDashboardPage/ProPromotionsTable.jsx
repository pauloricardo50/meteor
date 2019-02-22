import React from 'react';
import { compose } from 'recompose';

import T from 'core/components/Translation';
import { PromotionsTable } from 'core/components/PromotionsTable/PromotionsTable';
import PromotionsTableContainer from 'core/components/PromotionsTable/PromotionsTableContainer';

export default compose(
  PromotionsTableContainer,
  Component => (props) => {
    if (!props.rows.length) {
      return null;
    }

    return (
      <>
        <h3 className="text-center">
          <T id="ProDashboardPage.promotions" />
        </h3>
        <Component {...props} />
      </>
    );
  },
)(PromotionsTable);
