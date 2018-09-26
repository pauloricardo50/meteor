import React from 'react';
import PropTypes from 'prop-types';

import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';

import Icon from '../Icon';
import T from '../Translation';

const BorrowersSummary = ({ borrowers }) => (
  <div className="borrowers-summary">
    <h5>
      <T id="collections.borrowers" />
    </h5>
    <div className="borrowers-list">
      {borrowers.length > 0 ? (
        borrowers.map((borrower, index) => (
          <Chip
            style={{ margin: 8 }}
            key={borrower._id}
            avatar={(
              <Avatar>
                <Icon type="face" />
              </Avatar>
            )}
            label={
              borrower.name || (
                <T
                  id="BorrowersSummary.borrower"
                  values={{ index: index + 1 }}
                />
              )
            }
          />
        ))
      ) : (
        <T id="general.noBorrowersForLoan" />
      )}
    </div>
  </div>
);

BorrowersSummary.propTypes = {
  borrowers: PropTypes.array,
};

BorrowersSummary.defaultProps = {
  borrowers: [],
};

export default BorrowersSummary;
