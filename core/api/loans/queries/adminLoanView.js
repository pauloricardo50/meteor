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
        // TODO
        logic: 1,
        bonus: 1,
        salary: 1,
        files: 1
    }
});
