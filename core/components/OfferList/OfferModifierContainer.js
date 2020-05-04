import { withProps } from 'recompose';

import { offerUpdate } from '../../api/offers/methodDefinitions';
import { AdminOfferSchema } from '../../api/offers/offers';

const OfferModiferContainer = withProps(({ offer: { _id: offerId } }) => ({
  onSubmit: offer =>
    offerUpdate.run({
      object: offer,
      offerId,
    }),
  schema: AdminOfferSchema.omit('feedback'),
}));

export default OfferModiferContainer;
