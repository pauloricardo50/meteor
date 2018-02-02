import query from "core/api/loans/queries/adminLoansList";
import { withQuery } from "meteor/cultofcoders:grapher-react";
import LoansPage from "./LoansPage";

const LoansPageContainer = withQuery(() => query.clone(), {
    reactive: true
})(LoansPage);

export default LoansPageContainer;
