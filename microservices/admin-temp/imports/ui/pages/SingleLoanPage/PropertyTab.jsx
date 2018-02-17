import React from 'react';
import PropTypes from 'prop-types';
import { getLoanValue } from 'core/utils/loanFunctions';
import { IntlNumber } from 'core/components/Translation';

const PropertyTab = props => {
    const { loan, property } = props;

    return (
        <div>
            <h1>
                {property.name ||
                    property.address ||
                    property.address1 ||
                    property.address2}{' '}
                - Emprunt de{' '}
                <IntlNumber
                    value={getLoanValue({
                        loan,
                        property
                    })}
                    format="money"
                />
            </h1>
        </div>
    );
};

PropertyTab.propTypes = {
    loan: PropTypes.objectOf(PropTypes.any).isRequired,
    property: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default PropertyTab;
