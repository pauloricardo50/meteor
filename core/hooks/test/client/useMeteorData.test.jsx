// import { Meteor } from 'meteor/meteor';

// import React from 'react';
// import { expect } from 'chai';

// import { INTEREST_RATES_COLLECTION } from '../../../api/interestRates/interestRatesConstants';
// import { interestRatesRemove } from '../../../api/interestRates/methodDefinitions';
// import { ROLES } from '../../../api/users/userConstants';
// import {
//   callMethod,
//   resetDatabase,
//   userLogin,
// } from '../../../utils/testHelpers';
// import {
//   cleanup,
//   fireEvent,
//   render,
// } from '../../../utils/testHelpers/testing-library';
// import { useStaticMeteorData } from '../../useMeteorData';

// const TestComponent = props => {
//   const { loading, data, refetch } = useStaticMeteorData({
//     query: INTEREST_RATES_COLLECTION,
//     params: { _id: 1 },
//     ...props,
//   });

//   return (
//     <div>
//       <div>count: {typeof data === 'number' && data}</div>
//       <div>single result: {data?._id && 'true'}</div>
//       <div>results: {data?.length}</div>
//       <div>loading: {`${loading}`}</div>
//       <button
//         type="button"
//         onClick={() => refetch({ params: { _id: 1, $options: { limit: 10 } } })}
//       >
//         Refetch limit
//       </button>
//     </div>
//   );
// };

// describe('useMeteorData', () => {
//   beforeEach(async () => {
//     await cleanup();
//     await resetDatabase();
//     await new Promise(res => Meteor.logout(res));
//     await userLogin({ role: ROLES.ADMIN });
//   });

//   afterEach(async () => {
//     await new Promise(res => Meteor.logout(res));
//   });

//   describe('useStaticMeteorData', () => {
//     it('refetches the query after a method call', async () => {
//       const {
//         ids: { interestRates },
//       } = await callMethod('generateScenario', {
//         scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
//       });
//       const { findByText } = render(<TestComponent />);

//       await findByText('results: 25');

//       await interestRatesRemove.run({ interestRatesId: interestRates[0] });

//       await findByText('results: 24');
//     });

//     it('does not refetch after a method call if specified', async () => {
//       const {
//         ids: { interestRates },
//       } = await callMethod('generateScenario', {
//         scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
//       });
//       const { findByText, getByText } = render(
//         <TestComponent refetchOnMethodCall={false} />,
//       );

//       await findByText('results: 25');

//       await interestRatesRemove.run({ interestRatesId: interestRates[0] });
//       await new Promise(r => setTimeout(r, 200));

//       await findByText('loading: false');
//       expect(!!getByText('results: 25')).to.equal(true);
//     });

//     it('refetches with new query params', async () => {
//       await callMethod('generateScenario', {
//         scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
//       });
//       const { findByText, getByText } = render(
//         <TestComponent refetchOnMethodCall={false} />,
//       );

//       fireEvent.click(getByText('Refetch limit'));

//       await findByText('results: 10');
//     });

//     it('refetches with new query params and listeners reuse them', async () => {
//       const {
//         ids: { interestRates },
//       } = await callMethod('generateScenario', {
//         scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
//       });
//       const { findByText, getByText } = render(
//         <TestComponent refetchOnMethodCall={false} />,
//       );

//       fireEvent.click(getByText('Refetch limit'));

//       await findByText('results: 10');

//       await interestRatesRemove.run({ interestRatesId: interestRates[0] });
//       await new Promise(r => setTimeout(r, 200));

//       await findByText('results: 10');
//     });

//     it('fetches only one result if asked', async () => {
//       await callMethod('generateScenario', {
//         scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
//       });
//       const { findByText } = render(
//         <TestComponent refetchOnMethodCall={false} type="single" />,
//       );

//       await findByText('single result: true');
//     });

//     it('fetches a count', async () => {
//       await callMethod('generateScenario', {
//         scenario: { interestRates: Array.from({ length: 100 }, () => ({})) },
//       });
//       const { findByText } = render(
//         <TestComponent refetchOnMethodCall={false} type="count" />,
//       );

//       await findByText('count: 100');
//     });
//   });
// });
