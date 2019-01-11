import { addressReducer } from '../reducers';
import Properties from '.';

Properties.addReducers({
  ...addressReducer,
  totalValue: {
    body: { value: 1, landValue: 1, constructionValue: 1, margin: 1 },
    reduce: ({
      value = 0,
      landValue = 0,
      constructionValue = 0,
      margin = 0,
    }) => {
      if (value) {
        return value;
      }

      return landValue + constructionValue + margin;
    },
  },
});
