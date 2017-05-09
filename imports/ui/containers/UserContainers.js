import AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _DashboardPage from '/imports/ui/pages/user/DashboardPage.jsx';
import _BorrowerPage from '/imports/ui/pages/user/BorrowerPage.jsx';
import _PropertyPage from '/imports/ui/pages/user/PropertyPage.jsx';
import _AuctionPage from '/imports/ui/pages/user/AuctionPage.jsx';
import _LenderPickerPage from '/imports/ui/pages/user/LenderPickerPage.jsx';
import _StructurePage from '/imports/ui/pages/user/StructurePage.jsx';
import _VerificationPage from '/imports/ui/pages/user/VerificationPage.jsx';
import _ExpertisePage from '/imports/ui/pages/user/ExpertisePage.jsx';
import _FinalStepsPage from '/imports/ui/pages/user/FinalStepsPage.jsx';

import { userContainer, userRequestContainer, userBorrowerContainer } from './Containers';

export const UserLayout = userContainer(AppLayout);
export const DashboardPage = userRequestContainer(_DashboardPage);
export const BorrowerPage = userRequestContainer(_BorrowerPage);
export const PropertyPage = userRequestContainer(_PropertyPage);
export const AuctionPage = userRequestContainer(_AuctionPage);
export const LenderPickerPage = userRequestContainer(_LenderPickerPage);
export const StructurePage = userRequestContainer(_StructurePage);
export const VerificationPage = userRequestContainer(_VerificationPage);
export const ExpertisePage = userRequestContainer(_ExpertisePage);
export const FinalStepsPage = userRequestContainer(_FinalStepsPage);
