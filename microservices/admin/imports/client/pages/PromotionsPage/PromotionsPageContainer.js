import { withProps, compose } from 'recompose';
import { useHistory } from 'react-router-dom';

import { promotionInsert } from 'core/api/methods/index';
import { createRoute } from 'core/utils/routerUtils';
import ADMIN_ROUTES from 'imports/startup/client/adminRoutes';

export default compose(
  withProps(() => {
    const history = useHistory();

    return {
      addPromotion: promotion =>
        promotionInsert.run({ promotion }).then(promotionId =>
          history.push(
            createRoute(ADMIN_ROUTES.ADMIN_PROMOTION_PAGE.path, {
              promotionId,
              tabId: 'management',
            }),
          ),
        ),
    };
  }),
);
