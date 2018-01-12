import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router-dom';

import track from 'core/utils/analytics';
import { T } from 'core/components/Translation';
import { getBorrowerCompletion } from 'core/utils/borrowerFunctions';
import DashboardItem from './DashboardItem';
import BorrowerAdder from '../../components/BorrowerAdder';

const DashboardBorrowers = ({ borrowers, loanRequest }) => (
  <DashboardItem
    className="dashboard-list"
    title={
      <T id="DashboardBorrowers.title" values={{ count: borrowers.length }} />
    }
  >
    {borrowers.map((b, i) => {
      const percent = getBorrowerCompletion(b);

      return (
        <Link
          to={`/requests/${loanRequest._id}/borrowers/${b._id}/personal`}
          key={b._id}
          className="link"
          onClick={() => track('clicked dashboard borrower', {})}
        >
          <span
            className="icon fa fa-user-circle-o fa-4x"
            style={{ marginRight: 16 }}
          />
          <div className="text">
            <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>
              {b.firstName && b.lastName ? (
                `${b.firstName} ${b.lastName}`
              ) : (
                <T
                  id="DashboardBorrowers.itemTitle"
                  values={{ index: i + 1 }}
                />
              )}
            </h4>
            <h4
              className={classnames({
                'fixed-size no-margin': true,
                secondary: percent < 1,
                success: percent >= 1,
              })}
            >
              <T id="PropertyPage.progress" values={{ value: percent }} />{' '}
              {percent >= 1 && <span className="fa fa-check" />}
            </h4>
          </div>
        </Link>
      );
    })}
    {borrowers.length === 1 && (
      <BorrowerAdder requestId={loanRequest._id} style={{ marginTop: 8 }} />
    )}
  </DashboardItem>
);

DashboardBorrowers.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardBorrowers;
