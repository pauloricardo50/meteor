// @flow
import React from 'react';

import { OWN_FUNDS_USAGE_TYPES, OWN_FUNDS_TYPES } from 'core/api/constants';
import Icon from 'core/components/Icon';
import T from '../../../../Translation';

type FinancingOwnFundsWithdrawWarningProps = {};

const FinancingOwnFundsWithdrawWarning = ({
    usageType,
    type,
}: FinancingOwnFundsWithdrawWarningProps) => {
    // Withdrawals of LPP and 3A are taxable
    const isWithdrawTaxable =
        usageType === OWN_FUNDS_USAGE_TYPES.WITHDRAW &&
        Object.values(OWN_FUNDS_TYPES)
            .filter(x => x !== OWN_FUNDS_TYPES.INSURANCE_3B)
            .includes(type);

    if (isWithdrawTaxable) {
        return (
            <p className="financing-withdraw-warning primary">
                <Icon type="info" className="icon" />
                <T id="FinancingOwnFundsWithdrawWarning.description" />
            </p>
        );
    }

    return null;
};

export default FinancingOwnFundsWithdrawWarning;
