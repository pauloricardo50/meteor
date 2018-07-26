import Loans from '../loans';
import { LOAN_QUERIES, INTEREST_RATES } from '../../constants';

export default Loans.createQuery(LOAN_QUERIES.ADMIN_LOAN, {
  $filter({ filters, params }) {
    filters._id = params._id;
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
  properties: {
    userId: 1,
    createdAt: 1,
    updatedAt: 1,
    status: 1,
    value: 1,
    propertyWork: 1,
    usageType: 1,
    investmentRent: 1,
    style: 1,
    address: 1,
    address1: 1,
    address2: 1,
    zipCode: 1,
    city: 1,
    constructionYear: 1,
    renovationYear: 1,
    insideArea: 1,
    landArea: 1,
    balconyArea: 1,
    terraceArea: 1,
    roomCount: 1,
    bathroomCount: 1,
    toiletCount: 1,
    volume: 1,
    volumeNorm: 1,
    parking: 1,
    minergie: 1,
    isCoproperty: 1,
    isNew: 1,
    copropertyPercentage: 1,
    cityPlacementQuality: 1,
    buildingPlacementQuality: 1,
    buildingQuality: 1,
    flatQuality: 1,
    materialsQuality: 1,
    otherNotes: 1,
    pictures: 1,
    name: 1,
    latitude: 1,
    longitude: 1,
    nearestBusStation: 1,
    nearestTrainStation: 1,
    customFields: 1,
    adminValidation: 1,
    documents: 1,
  },
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
    standardOffer: {
      amortization: 1,
      maxAmount: 1,
      ...Object.values(INTEREST_RATES).reduce(
        (acc, rate) => ({ ...acc, [rate]: 1 }),
        {},
      ),
    },
    counterpartOffer: {
      amortization: 1,
      maxAmount: 1,
      ...Object.values(INTEREST_RATES).reduce(
        (acc, rate) => ({ ...acc, [rate]: 1 }),
        {},
      ),
    },
  },
  userFormsEnabled: 1,
});
