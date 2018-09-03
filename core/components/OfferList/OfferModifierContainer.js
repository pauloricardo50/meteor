import { withProps } from 'recompose';
import { offerUpdate } from '../../api';

const OfferModiferContainer = withProps(({ offer: { _id: offerId } }) => ({
  onSubmit: formValues => offerUpdate.run({ object: formValues, offerId }),
}));

export default OfferModiferContainer;
