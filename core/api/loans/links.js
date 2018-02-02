import { Loans, Properties } from "../";

Loans.addLinks({
    propertyLink: {
        field: "property",
        collection: Properties,
        type: "one"
    }
});
