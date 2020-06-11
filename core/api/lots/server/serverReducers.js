import assigneeReducer from '../../reducers/assigneeReducer';
import Lots from '..';

Lots.addReducers({
  ...assigneeReducer(
    { promotions: { userLinks: 1 } },
    ({ promotions }) =>
      !!(
        promotions &&
        promotions.length > 0 &&
        promotions[0].userLinks &&
        promotions[0].userLinks.length > 0
      ) && promotions[0].userLinks[0]._id,
  ),
});
