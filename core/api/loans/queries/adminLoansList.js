import { Loans } from "../../";

export default Loans.createQuery("adminLoansList", {
    name: 1,
    logic: 1,
    general: 1,
    property: {
        value: 1
    }
});
