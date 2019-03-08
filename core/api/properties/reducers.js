import addressReducer from '../reducers/addressReducer';
import Properties from '.';

Properties.addReducers({
  ...addressReducer,
  totalValue: {
    body: { value: 1, landValue: 1, constructionValue: 1, additionalMargin: 1 },
    reduce: ({
      value = 0,
      landValue = 0,
      constructionValue = 0,
      additionalMargin = 0,
    }) => {
      if (value) {
        return value;
      }

      return landValue + constructionValue + additionalMargin;
    },
  },
});
