import { Loans, Properties, Borrowers } from "../";

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
    }
});
