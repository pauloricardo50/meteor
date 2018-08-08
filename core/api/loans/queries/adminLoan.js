import { formatLoanWithStructure } from '../../../utils/loanFunctions';
import Loans from '../loans';
import { LOAN_QUERIES } from '../../constants';
import { adminPropertyFragment } from '../../properties/queries/propertyFragments';

export default Loans.createQuery(LOAN_QUERIES.ADMIN_LOAN, {
  $filter({ filters, params }) {
    filters._id = params._id;
  },
  $postFilter(loans) {
    return loans.map(formatLoanWithStructure);
  },
  userId: 1,
  user: {
    roles: 1,
  },
  name: 1,
  logic: 1,
  general: 1,
  createdAt: 1,
  updatedAt: 1,
  adminNote: 1,
  adminValidation: 1,
  documents: 1,
  properties: adminPropertyFragment,
  borrowerIds: 1,
  borrowers: {
    firstName: 1,
    lastName: 1,
    gender: 1,
    address1: 1,
    zipCode: 1,
    city: 1,
    age: 1,
    birthPlace: 1,
    civilStatus: 1,
    childrenCount: 1,
    company: 1,
    personalBank: 1,
    isSwiss: 1,
    isUSPerson: 1,
    worksForOwnCompany: 1,
    sameAddress: 1,
    salary: 1,
    bonusExists: 1,
    bonus: 1,
    otherIncome: 1,
    expenses: 1,
    realEstate: 1,
    bankFortune: 1,
    insuranceSecondPillar: 1,
    insuranceThirdPillar: 1,
    documents: 1,
    logic: 1,
    otherFortune: 1,
    corporateBankExists: 1,
    adminValidation: 1,
  },
  tasks: {
    status: 1,
    type: 1,
    createdAt: 1,
    updatedAt: 1,
    dueAt: 1,
    assignedEmployee: {
      emails: 1,
      roles: 1,
      username: 1,
    },
    loan: {
      name: 1,
      user: {
        assignedEmployeeId: 1,
      },
    },
  },
  offers: {
    organization: 1,
    conditions: 1,
    counterparts: 1,
    canton: 1,
    standardOffer: 1,
    counterpartOffer: 1,
  },
  userFormsEnabled: 1,
  contacts: 1,
  structures: 1,
  selectedStructure: 1,
});
