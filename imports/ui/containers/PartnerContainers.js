import AppLayout from '/imports/ui/layouts/AppLayout.jsx';

import {
  partnerContainer,
  partnerOfferContainer,
  partnerRequestContainer,
} from './Containers';

export const PartnerLayout = partnerContainer(AppLayout);
