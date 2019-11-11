import Lots from '..';
import assigneeReducer from '../../reducers/assigneeReducer';

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
