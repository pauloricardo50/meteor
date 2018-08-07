import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';
import { loanSummary } from '../../loans/queries/loanFragments';

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
  address1: 1,
  address2: 1,
  city: 1,
  zipCode: 1,
  value: 1,
  status: 1,
  style: 1,
  insideArea: 1,
  roomCount: 1,
  landArea: 1,
  constructionYear: 1,
  renovationYear: 1,
  balconyArea: 1,
  terraceArea: 1,
  investmentRent: 1,
  createdAt: 1,
  user: {
    emails: 1,
    assignedEmployee: { emails: 1 },
  },
  loans: loanSummary,
  valuation: {
    min: 1,
    max: 1,
    value: 1,
    status: 1,
    error: 1,
    date: 1,
    microlocation: 1,
  },
});
