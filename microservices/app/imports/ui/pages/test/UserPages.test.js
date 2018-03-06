// /* eslint-env mocha */
// import { Meteor } from 'meteor/meteor';
// import { expect } from 'chai';
// import {
//   getMountedComponent,
//   stubCollections,
//   generateData,
// } from 'core/utils/testHelpers';
// import { resetDatabase } from 'meteor/xolvio:cleaner';
//
// // User pages
// import AccountPage from '../AccountPage';
// import AuctionPage from '../AuctionPage';
// import BorrowerPage from '../BorrowerPage';
// import DashboardPage from '../DashboardPage';
// import ContractPage from '../ContractPage';
// import ClosingPage from '../ClosingPage';
// import OfferPickerPage from '../OfferPickerPage';
// import PropertyPage from '../PropertyPage';
// import StructurePage from '../StructurePage';
// import VerificationPage from '../VerificationPage';
// import FinancePage from '../FinancePage';
// import ComparePage from '../ComparePage';
// import AppPage from '../AppPage';
//
// const pages = {
//   AccountPage,
//   AuctionPage,
//   BorrowerPage,
//   DashboardPage,
//   ContractPage,
//   ClosingPage,
//   OfferPickerPage,
//   PropertyPage,
//   StructurePage,
//   VerificationPage,
//   ComparePage,
//   AppPage,
//   FinancePage,
// };
//
// if (Meteor.isClient) {
//   describe('User Pages basic render', () => {
//     beforeEach(() => {
//       resetDatabase();
//       stubCollections();
//     });
//
//     afterEach(() => {
//       stubCollections.restore();
//     });
//
//     Object.keys(pages).forEach((key) => {
//       const page = pages[key];
//       describe(`${key}`, () => {
//         let props;
//         const component = () =>
//           getMountedComponent({
//             Component: page,
//             props,
//             withRouter: true,
//             withStore: true,
//           });
//
//         beforeEach(() => {
//           getMountedComponent.reset();
//           const data = generateData({ user: { roles: 'dev' } });
//
//           props = {
//             ...data,
//             currentUser: data.user,
//             location: {},
//             history: {},
//             match: {
//               params: {
//                 borrowerId: data.borrowers[0]._id,
//                 loanId: data.loan._id,
//               },
//             },
//           };
//
//           console.log('userpages props:', props);
//         });
//
//         it('Renders correctly', () => {
//           const sections = component().find('section');
//
//           expect(sections.length).to.be.at.least(1);
//         });
//       });
//     });
//   });
// }
