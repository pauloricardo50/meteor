// // @flow
// /* eslint-env mocha */
// import { expect } from 'chai';
// import { resetDatabase } from 'meteor/xolvio:cleaner';

// import PromotionService from '../../../promotions/server/PromotionService';
// import PromotionReservationService from '../../../promotionReservations/server/PromotionReservationService';
// import generator from '../../../factories/index';
// import {
//   PROMOTION_LOT_STATUS,
//   PROMOTION_RESERVATION_STATUS,
//   AGREEMENT_STATUSES,
//   PROMOTION_RESERVATION_BANK_STATUS,
//   DEPOSIT_STATUSES,
// } from '../../../constants';
// import { up, down } from '../25';

// describe('Migration 25', () => {
//   beforeEach(() => resetDatabase());

//   describe('up', () => {
//     it('sets agreementDuration on all promotions', async () => {
//       await PromotionService.collection.rawCollection().insert({ _id: 'a' });
//       await PromotionService.collection.rawCollection().insert({ _id: 'b' });

//       await up();

//       const promotions = PromotionService.find().fetch();
//       expect(promotions.length).to.equal(2);
//       promotions.forEach((p) => {
//         expect(p.agreementDuration).to.equal(30);
//       });
//     });

//     it('creates a promotionReservation for each booked or sold promotionLot', async () => {
//       generator({
//         properties: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }],
//         promotions: {
//           promotionLots: [
//             {
//               status: PROMOTION_LOT_STATUS.AVAILABLE,
//               propertyLinks: [{ _id: 'a' }],
//             },
//             {
//               status: PROMOTION_LOT_STATUS.BOOKED,
//               propertyLinks: [{ _id: 'b' }],
//               promotionOptions: { loan: { _id: 'loan1' } },
//               attributedTo: { _id: 'loan1' },
//             },
//             {
//               status: PROMOTION_LOT_STATUS.SOLD,
//               propertyLinks: [{ _id: 'c' }],
//               promotionOptions: { loan: { _id: 'loan2' } },
//               attributedTo: { _id: 'loan2' },
//             },
//           ],
//         },
//       });

//       await up();

//       const pRs = PromotionReservationService.find(
//         {},
//         { sort: { status: 1 } },
//       ).fetch();
//       expect(pRs.length).to.equal(2);
//       expect(pRs[0].status).to.equal(PROMOTION_RESERVATION_STATUS.ACTIVE);
//       expect(pRs[1].status).to.equal(PROMOTION_RESERVATION_STATUS.COMPLETED);
//     });

//     it('sets agreement to waiting on booked lots', async () => {
//       generator({
//         properties: { _id: 'a' },
//         promotions: {
//           promotionLots: {
//             status: PROMOTION_LOT_STATUS.BOOKED,
//             propertyLinks: [{ _id: 'b' }],
//             promotionOptions: { loan: { _id: 'loan1' } },
//             attributedTo: { _id: 'loan1' },
//           },
//         },
//       });

//       await up();

//       const pRs = PromotionReservationService.find({}).fetch();
//       expect(pRs[0].reservationAgreement).to.deep.include({
//         status: AGREEMENT_STATUSES.WAITING,
//       });
//     });

//     it('sets statuses on sold lots', async () => {
//       generator({
//         properties: { _id: 'a' },
//         promotions: {
//           promotionLots: {
//             status: PROMOTION_LOT_STATUS.SOLD,
//             propertyLinks: [{ _id: 'b' }],
//             promotionOptions: { loan: { _id: 'loan1' } },
//             attributedTo: { _id: 'loan1' },
//           },
//         },
//       });

//       await up();

//       const pRs = PromotionReservationService.find({}).fetch();
//       expect(pRs[0].reservationAgreement).to.deep.include({
//         status: AGREEMENT_STATUSES.WAITING,
//       });
//       expect(pRs[0].lender).to.deep.include({
//         status: PROMOTION_RESERVATION_BANK_STATUS.VALIDATED,
//       });
//       expect(pRs[0].deposit).to.deep.include({
//         status: DEPOSIT_STATUSES.PAID,
//       });
//     });
//   });

//   describe('down', () => {
//     it('removes all promotionReservations', async () => {
//       generator({
//         properties: [{ _id: 'a' }, { _id: 'b' }, { _id: 'c' }],
//         promotions: {
//           promotionLots: [
//             {
//               status: PROMOTION_LOT_STATUS.AVAILABLE,
//               propertyLinks: [{ _id: 'a' }],
//             },
//             {
//               status: PROMOTION_LOT_STATUS.BOOKED,
//               propertyLinks: [{ _id: 'b' }],
//               promotionOptions: { loan: { _id: 'loan1' } },
//               attributedTo: { _id: 'loan1' },
//             },
//             {
//               status: PROMOTION_LOT_STATUS.SOLD,
//               propertyLinks: [{ _id: 'c' }],
//               promotionOptions: { loan: { _id: 'loan2' } },
//               attributedTo: { _id: 'loan2' },
//             },
//           ],
//         },
//       });

//       await up();
//       await down();

//       const pRs = PromotionReservationService.find({}).fetch();

//       expect(pRs.length).to.equal(0);
//     });
//   });
// });
