import PromotionOptions from '..';
import assigneeReducer from '../../reducers/assigneeReducer';

PromotionOptions.addReducers({
  ...assigneeReducer(
    { promotionLots: { promotion: { userLinks: 1 } } },
    ({ promotionLots }) =>
      promotionLots[0].promotion.userLinks.length > 0 &&
      promotionLots[0].promotion.userLinks[0]._id,
  ),
});
