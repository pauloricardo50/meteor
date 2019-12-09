import './testFactories';
import { Factory } from 'meteor/dburles:factory';

import { PROPERTY_TYPE } from '../../../../constants';
import LoanService from '../../../../loans/server/LoanService';
import { adminLoan } from '../../../../fragments';
import {
  fakeBorrower,
  FAKE_HOUSE,
  FAKE_APPARTMENT,
  fakeStructure,
} from './fakes';

export const getSingleBorrowerLoan = ({
  purchaseType,
  residenceType,
  borrowers,
  propertyType,
  structures,
}) => {
  const borrowerId = Factory.create('testBorrower', fakeBorrower(borrowers))
    ._id;
  const propertyId = Factory.create('testProperty', {
    ...(propertyType === PROPERTY_TYPE.FLAT ? FAKE_APPARTMENT : FAKE_HOUSE),
  })._id;

  return Factory.create('testLoan', {
    purchaseType,
    residenceType,
    borrowerIds: [borrowerId],
    propertyIds: [propertyId],
    structures: structures.map(structure =>
      fakeStructure({ borrowerIds: [borrowerId], ...structure }),
    ),
  })._id;
};

export const getTwoBorrowersLoan = ({
  purchaseType,
  residenceType,
  borrowers,
  propertyType,
  structures,
}) => {
  const borrower1Id = Factory.create(
    'testBorrower',
    fakeBorrower({ ...borrowers[0] }),
  )._id;
  const borrower2Id = Factory.create(
    'testBorrower',
    fakeBorrower({ ...borrowers[1] }),
  )._id;
  const propertyId = Factory.create('testProperty', {
    ...(propertyType === PROPERTY_TYPE.FLAT ? FAKE_APPARTMENT : FAKE_HOUSE),
  })._id;

  const finalStructures = structures.map(structure =>
    fakeStructure({
      borrowerIds: [borrower1Id, borrower2Id],
      propertyId,
      ...structure,
    }),
  );

  return Factory.create('testLoan', {
    purchaseType,
    residenceType,
    borrowerIds: [borrower1Id, borrower2Id],
    propertyIds: [propertyId],
    structures: finalStructures,
    selectedStructure: finalStructures[0].id,
  })._id;
};

export const getFullLoan = loanId => LoanService.get(loanId);
