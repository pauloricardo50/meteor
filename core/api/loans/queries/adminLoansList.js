import { Loans } from "../../";

export default Loans.createQuery("adminLoansList", {
    $options: {
        sort: {
            createdAt: -1
        }
    },
    name: 1,
    logic: 1,
    general: 1,
    createdAt: 1,
    updatedAt: 1,
    propertyLink: {
        value: 1
    }
});
