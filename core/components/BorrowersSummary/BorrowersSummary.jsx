import { Meteor } from 'meteor/meteor';

import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Icon from '../Icon';
import { CollectionIconLink } from '../IconLink';
import T from '../Translation';

const BorrowersSummary = ({
  borrowers,
  showTitle = true,
  className,
  title,
  emptyState,
}) => {
  const isAdmin = Meteor.microservice === 'admin';
  return (
    <div className={cx('borrowers-summary', className)}>
      {showTitle && <h5>{title || <T id="collections.borrowers" />}</h5>}
      <div className="borrowers-list">
        {borrowers.length > 0
          ? borrowers.map((borrower, index) =>
              isAdmin ? (
                <CollectionIconLink relatedDoc={borrower} />
              ) : (
                <Chip
                  style={{ margin: 8 }}
                  key={borrower._id}
                  avatar={
                    <Avatar>
                      <Icon type="face" />
                    </Avatar>
                  }
                  label={
                    borrower.name || (
                      <T
                        id="BorrowersSummary.borrower"
                        values={{ index: index + 1 }}
                      />
                    )
                  }
                />
              ),
            )
          : emptyState || <T id="general.noBorrowersForLoan" />}
      </div>
    </div>
  );
};

BorrowersSummary.propTypes = {
  borrowers: PropTypes.array,
};

BorrowersSummary.defaultProps = {
  borrowers: [],
};

export default BorrowersSummary;
