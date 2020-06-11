import { compose, withProps } from 'recompose';

import { addProUserToPromotion } from '../../../../../api/promotions/methodDefinitions';

export default compose(
  withProps(({ promotion }) => ({
    addUser: ({ userId }) =>
      addProUserToPromotion.run({ promotionId: promotion._id, userId }),
  })),
);
