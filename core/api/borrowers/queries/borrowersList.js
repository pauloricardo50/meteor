import { Borrowers } from "../../";

export default Borrowers.createQuery("adminBorrowersList", {
    $options: {
        sort: {
            createdAt: -1
        }
    },
    firstName: 1,
    lastName: 1,
    createdAt: 1,
    updatedAt: 1
});