import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import { personalInfoPercent, propertyPercent } from '/imports/js/arrays/steps';

const OverviewItems = props => (
  <article className="overview-items">
    {props.borrowers.map((borrower, i) => (
      <Link
        to={`/app/borrowers/${borrower._id}`}
        className="mask1 animated fadeIn hover-rise borrower-recap"
        key={borrower._id}
      >
        <div className="image">
          <span className="fa fa-user-circle-o fa-5x" />
        </div>
        <div className="text">
          <h3 className="fixed-size">
            {borrower.firstName || `Emprunteur ${i + 1}`}
          </h3>
          <p className="secondary">
            Progrès: {Math.round(personalInfoPercent([borrower]) * 1000) / 10}%
          </p>
        </div>
      </Link>
    ))}
    <Link
      to={`/app/requests/${props.loanRequest._id}/property`}
      className="mask1 animated fadeIn hover-rise request-recap"
    >
      <div className="image">
        <span className="fa fa-home fa-5x" />
      </div>
      <div className="text">
        <h3 className="fixed-size">{props.loanRequest.name || 'Sans Titre'}</h3>
        <p className="secondary">
          Progrès:
          {' '}
          {Math.round(
            propertyPercent(props.loanRequest, props.borrowers) * 1000,
          ) / 10}
          %
        </p>
      </div>
    </Link>
  </article>
);

OverviewItems.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
  borrowers: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default OverviewItems;
