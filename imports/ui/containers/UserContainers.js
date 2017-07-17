import AppLayout from '/imports/ui/layouts/AppLayout.jsx';
import _DashboardPage from '/imports/ui/pages/user/DashboardPage.jsx';
import _BorrowerPage from '/imports/ui/pages/user/BorrowerPage.jsx';
import _PropertyPage from '/imports/ui/pages/user/PropertyPage.jsx';
import _AuctionPage from '/imports/ui/pages/user/AuctionPage.jsx';
import _LenderPickerPage from '/imports/ui/pages/user/LenderPickerPage.jsx';
import _StructurePage from '/imports/ui/pages/user/StructurePage.jsx';
import _VerificationPage from '/imports/ui/pages/user/VerificationPage.jsx';
import _ContractPage from '/imports/ui/pages/user/ContractPage.jsx';
import _ClosingPage from '/imports/ui/pages/user/ClosingPage.jsx';
import _DevPage from '/imports/ui/pages/user/DevPage.jsx';
import _FinancePage from '/imports/ui/pages/user/FinancePage.jsx';
import _ComparePage from '/imports/ui/pages/user/ComparePage.jsx';
import _AppPage from '/imports/ui/pages/user/AppPage.jsx';

import {
  userContainer,
  userRequestContainer,
  userBorrowerContainer,
} from './Containers';

export const UserLayout = userContainer(AppLayout);
export const DashboardPage = userRequestContainer(_DashboardPage);
export const BorrowerPage = userRequestContainer(_BorrowerPage);
export const PropertyPage = userRequestContainer(_PropertyPage);
export const AuctionPage = userRequestContainer(_AuctionPage);
export const LenderPickerPage = userRequestContainer(_LenderPickerPage);
export const StructurePage = userRequestContainer(_StructurePage);
export const VerificationPage = userRequestContainer(_VerificationPage);
export const ContractPage = userRequestContainer(_ContractPage);
export const ClosingPage = userRequestContainer(_ClosingPage);
export const DevPage = userContainer(_DevPage);
export const FinancePage = userRequestContainer(_FinancePage);
export const ComparePage = userContainer(_ComparePage);
export const AppPage = userContainer(_AppPage);
