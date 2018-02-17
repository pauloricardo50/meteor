import React from 'react';
import PropTypes from 'prop-types';

import { _ } from 'lodash';
import { FILE_STATUS } from 'core/api/constants';

const FileVerificationNotification = ({ loan, borrowers }) => {
    const allFiles = _.flattenDeep([
        Object.values(loan.files),
        borrowers.map(b => Object.values(b.files))
    ]);

    const toVerify = allFiles.reduce(
        (sum, file) => (file.status === FILE_STATUS.UNVERIFIED ? sum + 1 : sum),
        0
    );

    if (toVerify) {
        return (
            <div style={{ margin: '16px 0' }} className="mask1 flex center">
                <h3>{toVerify} fichier(s) à verifier</h3>
            </div>
        );
    }
    return null;
};

FileVerificationNotification.propTypes = {
    loan: PropTypes.objectOf(PropTypes.any).isRequired,
    borrowers: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default FileVerificationNotification;
