import addressReducer from '../reducers/addressReducer';
import Properties from '.';

Properties.addReducers({
  ...addressReducer,
  thumbnail: {
    body: { documents: { propertyImages: { url: 1 } }, imageUrls: 1 },
    reduce: ({ documents = {}, imageUrls = [] }) => {
      if (imageUrls.length > 0) {
        return imageUrls[0];
      }

      if (documents && documents.propertyImages) {
        return documents.propertyImages[0].url;
      }
    },
  },
  totalValue: {
    body: { value: 1, landValue: 1, constructionValue: 1, additionalMargin: 1 },
    reduce: ({
      value = 0,
      landValue = 0,
      constructionValue = 0,
      additionalMargin = 0,
    }) => value || landValue + constructionValue + additionalMargin,
  },
  valuePerSquareMeterInside: {
    body: { totalValue: 1, insideArea: 1 },
    reduce: ({ totalValue = 0, insideArea = 0 }) =>
      (insideArea === 0 ? 0 : totalValue / insideArea),
  },
  valuePerSquareMeterLand: {
    body: { totalValue: 1, landArea: 1 },
    reduce: ({ totalValue = 0, landArea = 0 }) =>
      (landArea === 0 ? 0 : totalValue / landArea),
  },
});
