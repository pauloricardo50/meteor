import React from 'react';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';

import { T } from '/imports/ui/components/general/Translation.jsx';

const DashboardBorrowers = props => {
  return (
    <div className="mask1 dashboard-borrowers">
      <h4 className="fixed-size bold" style={{ marginTop: 0 }}>Emprunteur</h4>
      {props.borrowers.map((b, i) =>
        <Link
          to={`/app/requests/${props.loanRequest._id}/borrowers/${b._id}/personal`}
          key={b._id}
          className="link"
        >
          <span className="fa fa-user-circle-o fa-4x" style={{ marginRight: 16 }} />
          <div className="text">
            <h4 className="fixed-size no-margin" style={{ marginBottom: 8 }}>
              {b.firstName && b.lastName
                ? `${b.firstName} ${b.lastName}`
                : <T id="DashboardBorrowers" values={{ index: i + 1 }} />}
              {b.age && <small> - {b.age} ans</small>}
            </h4>
            {b.age &&
              <h4 className="fixed-size secondary no-margin">
                <T id="DashboardBorrowers.age" values={{ value: b.age }} />
              </h4>}
          </div>
        </Link>,
      )}
    </div>
  );
};

DashboardBorrowers.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.object).isRequired,
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default DashboardBorrowers;
