import React from 'react';
import PropTypes from 'prop-types';

const BorrowerTab = props => {
    const { borrower } = props;

    return (
        <div>
            <h1>{borrower.firstName || borrower.lastName}</h1>
        </div>
    );
};

BorrowerTab.propTypes = {
    borrower: PropTypes.object.isRequired
};

export default BorrowerTab;
