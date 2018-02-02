import PropTypes from "prop-types";
import React from "react";

import AllLoansTable from "./AllLoansTable";

const AdminLoansPage = props => {
    if (props.isLoading) {
        return null;
    }

    return (
        <section className="mask1">
            <h1>Demandes de Prêt</h1>

            <AllLoansTable {...props} loans={props.data} />
        </section>
    );
};

AdminLoansPage.propTypes = {
    data: PropTypes.arrayOf(PropTypes.any),
    properties: PropTypes.arrayOf(PropTypes.object).isRequired
};

AdminLoansPage.defaultProps = {
    data: []
};

export default AdminLoansPage;
