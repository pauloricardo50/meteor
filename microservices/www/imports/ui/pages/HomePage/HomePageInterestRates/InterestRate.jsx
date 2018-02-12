import React from 'react';
import PropTypes from 'prop-types';

import { INTEREST_TREND } from 'core/api/constants';

const InterestRate = ({ type, low, high, trend }) => (
    <div className="rate">
        <span className="type">{type}</span>
        <span className="value">
            <span className={`trend ${trend}`} /> {low} - {high}
        </span>
    </div>
);

InterestRate.propTypes = {};

export default InterestRate;
