import { Loans, Users, Borrowers } from "../";

Users.addLinks({
    loansLink: {
        collection: Loans,
        inversedBy: "userLink"
    }
});