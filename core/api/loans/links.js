import { Loans, Properties, Borrowers, Users } from "../";

Loans.addLinks({
    propertyLink: {
        field: "property",
        collection: Properties,
        type: "one"
    },
    borrowersLink: {
        field: "borrowers",
        collection: Borrowers,
        type: "many"
    },
    userLink: {
        field: "userId",
        collection: Users,
        type:"one"
    }
});
