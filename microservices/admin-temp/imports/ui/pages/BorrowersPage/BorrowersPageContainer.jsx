import query from "core/api/borrowers/queries/borrowersList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import BorrowersPage from "./BorrowersPage";

const BorrowersPageContainer = withQuery(() => query.clone(), {
    reactive: true
})(BorrowersPage);

export default BorrowersPageContainer;