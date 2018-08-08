import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { adminPropertyFragment } from './propertyFragments';

export default Properties.createQuery(PROPERTY_QUERIES.ADMIN_PROPERTY, {
  $filter({ filters, params: { propertyId } }) {
    filters._id = propertyId;
  },
  $postFilter(properties) {
    return properties.map(({ loans, ...property }) => ({
      ...property,
      loans: loans.map(formatLoanWithStructure),
    }));
  },
  ...adminPropertyFragment,
});
