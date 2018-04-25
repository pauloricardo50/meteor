import Borrowers from '..';
import { BORROWER_QUERIES } from '../borrowerConstants';

export default Borrowers.createQuery(BORROWER_QUERIES.BORROWER, {
  $filter({ filters, params }) {
    filters._id = params._id;
    console.log('query params: ', params);
  },
  firstName: 1,
  lastName: 1,
  createdAt: 1,
  updatedAt: 1,
  gender: 1,
  age: 1,
  address: 1,
  user: {
    emails: 1,
    assignedEmployee: { emails: 1 },
  },
  // fields used in LoanSummary component
  loans: {
    _id: 1,
    name: 1,
    logic: { step: 1 },
    general: { fortuneUsed: 1, insuranceFortuneUsed: 1 },
    createdAt: 1,
    updatedAt: 1,
    borrowers: 1,
    property: { value: 1 },
  },
  // fileds used in Recap component
  salary: 1,
  otherIncome: 1,
  expenses: 1,
  bankFortune: 1,
  insuranceSecondPillar: 1,
  insuranceThirdPillar: 1,
  realEstate: 1,
});
