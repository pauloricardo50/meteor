// @flow
import Properties from '..';
import { PROPERTY_QUERIES } from '../propertyConstants';

export default Properties.createQuery(PROPERTY_QUERIES.USER_PROPERTY, {
  $filter({ filters, params: { propertyId } }) {
    filters._id = propertyId;
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
  // fields used in LoanSummary component
  loans: {
    name: 1,
    logic: { step: 1 },
    createdAt: 1,
    updatedAt: 1,
    borrowers: { firstName: 1, lastName: 1 },
    property: { value: 1 },
  },
});

export type userProperty = {
  value: number,
  address1: string,
  style: string,
};
