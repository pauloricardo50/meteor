import { withProps } from 'recompose';
import { offerUpdate } from '../../api';

const OfferModiferContainer = withProps(({ offer: { _id: offerId } }) => ({
  onSubmit: formValues =>
    offerUpdate.run({
      object: {
        ...formValues,
        organisationLink: { _id: formValues.organisation },
      },
      offerId,
    }),
}));

export default OfferModiferContainer;
