import AppLayout from '/imports/ui/layouts/AppLayout';
import _DashboardPage from '/imports/ui/pages/DashboardPage';
import _BorrowerPage from '/imports/ui/pages/BorrowerPage';
import _PropertyPage from '/imports/ui/pages/PropertyPage';
import _AuctionPage from '/imports/ui/pages/AuctionPage';
import _StrategyPage from '/imports/ui/pages/StrategyPage';
import _OfferPickerPage from '/imports/ui/pages/OfferPickerPage';
import _StructurePage from '/imports/ui/pages/StructurePage';
import _VerificationPage from '/imports/ui/pages/VerificationPage';
import _ContractPage from '/imports/ui/pages/ContractPage';
import _ClosingPage from '/imports/ui/pages/ClosingPage';
import _DevPage from '/imports/ui/pages/DevPage';
import _FinancePage from '/imports/ui/pages/FinancePage';
import _ComparePage from '/imports/ui/pages/ComparePage';
import _AppPage from '/imports/ui/pages/AppPage';
import _FilesPage from '/imports/ui/pages/FilesPage';

import {
  userContainer,
  userRequestContainer,
  userBorrowerContainer,
  userCompareContainer,
} from './Containers';

export const UserLayout = userContainer(AppLayout);
export const DashboardPage = userRequestContainer(_DashboardPage);
export const BorrowerPage = userRequestContainer(_BorrowerPage);
export const PropertyPage = userRequestContainer(_PropertyPage);
export const AuctionPage = userRequestContainer(_AuctionPage);
export const StrategyPage = userRequestContainer(_StrategyPage);
export const OfferPickerPage = userRequestContainer(_OfferPickerPage);
export const StructurePage = userRequestContainer(_StructurePage);
export const VerificationPage = userRequestContainer(_VerificationPage);
export const ContractPage = userRequestContainer(_ContractPage);
export const ClosingPage = userRequestContainer(_ClosingPage);
export const DevPage = userContainer(_DevPage);
export const FinancePage = userRequestContainer(_FinancePage);
export const ComparePage = userCompareContainer(_ComparePage);
export const AppPage = userContainer(_AppPage);
export const FilesPage = userRequestContainer(_FilesPage);
