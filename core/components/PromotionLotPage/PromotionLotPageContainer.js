import propertyFiles from 'core/api/properties/queries/propertyFiles';
import mergeFilesWithQuery from 'core/api/files/mergeFilesWithQuery';

export default mergeFilesWithQuery(
  propertyFiles,
  ({ promotionLot: { properties } }) => ({ propertyId: properties[0]._id }),
  'promotionLot',
);
