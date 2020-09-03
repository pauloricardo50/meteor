import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { compose, withProps } from 'recompose';

import Button from 'core/components/Button';
import Icon from 'core/components/Icon';
import BasePromotionPage from 'core/components/PromotionPage/client';
import T from 'core/components/Translation';

import appRoutes from '../../../startup/client/appRoutes';
import { AppPromotionPageContainer } from '../AppPromotionPage/AppPromotionPage';

const PromotionPage = props => {
  const history = useHistory();
  const [initialHistoryLength] = useState(history.length);

  return (
    <div>
      <div
        className="flex sb"
        style={{ margin: '0 auto 16px', maxWidth: 1400 }}
      >
        <Button
          raised
          primary
          onClick={() => {
            // Because of tabbed navigation on the promotion page, you need
            // this hack to be able to go to the previous page properly
            // Sadly, it fails if you refresh the page
            history.go(initialHistoryLength - history.length - 1);
          }}
          icon={<Icon type="left" />}
        >
          <T id="general.back" />
        </Button>
      </div>

      <BasePromotionPage {...props} />
    </div>
  );
};

export default compose(
  AppPromotionPageContainer,
  withProps({ route: appRoutes.PROMOTION_PAGE.path }),
)(PromotionPage);
