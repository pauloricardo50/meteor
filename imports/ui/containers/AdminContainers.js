import AppLayout from '/imports/ui/layouts/AppLayout.jsx';

import {
  adminContainer,
  adminUserContainer,
  adminRequestContainer,
  adminOfferContainer,
} from './Containers';

export const AdminLayout = adminContainer(AppLayout);
