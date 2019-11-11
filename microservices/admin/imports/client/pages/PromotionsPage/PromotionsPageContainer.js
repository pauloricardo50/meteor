import { withProps, compose } from 'recompose';
import { promotionInsert } from 'imports/core/api/methods/index';

export default compose(
  withProps({
    addPromotion: promotion => promotionInsert.run({ promotion }),
  }),
);
