// import { Match } from 'meteor/check';

// import { makePromotionReservationAnonymizer } from 'core/api/promotions/server/promotionServerHelpers';
// import { exposeQuery } from '../../queries/queryHelpers';
// import { promotionReservations as query } from '../queries';

// exposeQuery({
//   query,
//   overrides: {
//     firewall(userId, params) {
//       params.userId = userId;
//     },
//     embody: (body) => {
//       body.$filter = ({
//         filters,
//         params: { promotionId, status, loanId, promotionLotId },
//       }) => {
//         filters['promotionLink._id'] = promotionId;

//         if (status) {
//           filters.status = status;
//         }

//         if (loanId) {
//           filters['loanLink._id'] = loanId;
//         }

//         if (promotionLotId) {
//           filters['promotionLotLink._id'] = promotionLotId;
//         }
//       };
//       body.$postFilter = (promotionReservations = [], params) =>
//         promotionReservations.map(makePromotionReservationAnonymizer(params));
//     },
//     validateParams: {
//       promotionId: String,
//       userId: String,
//       loanId: Match.Maybe(String),
//       promotionLotId: Match.Maybe(String),
//       status: Match.Maybe(Match.OneOf(String, Object)),
//     },
//   },
// });
