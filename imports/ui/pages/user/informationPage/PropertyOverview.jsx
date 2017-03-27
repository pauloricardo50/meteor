import React, { PropTypes } from 'react';

import { Link } from 'react-router-dom';

const PropertyOverview = props => (
  <article>
    <div className="requests">
      {props.loanRequests.map(request => (
        <Link
          to={`/app/requests/${request._id}`}
          className="mask1 animated fadeIn hover-rise request-recap"
          key={request._id}
        >
          <div className="image">
            <span className="fa fa-home fa-5x" />
          </div>
          <div className="text">
            <h3>{request.name || 'Sans Titre'}</h3>
            <p className="secondary">
              Progrès: 0%
            </p>
          </div>
        </Link>
      ))}
    </div>
  </article>
);

PropertyOverview.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};

PropertyOverview.defaultProps = {
  loanRequests: [],
};

export default PropertyOverview;
