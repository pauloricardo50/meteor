import { Loans } from "../../";

export default Loans.createQuery("adminLoanView", {
    $filter({ filters, params }) {
        filters._id = params._id;
    },
    name: 1,
    logic: 1,
    general: 1,
    createdAt: 1,
    updatedAt: 1,
    files: 1,
    propertyLink: {
        value: 1
    },
    borrowersLink: {
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
        files: 1,
        logic: 1,
        otherFortune: 1,
        corporateBankExists: 1,
        adminValidation: 1
    }
});
