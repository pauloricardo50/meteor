import React, { PropTypes } from 'react';

import { Link } from 'react-router-dom';

const BorrowerOverview = props => (
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
            Progrès: 0%
          </p>
        </div>
      </Link>
    ))}
    <Link
      to={`/app/requests/${props.loanRequest._id}`}
      className="mask1 animated fadeIn hover-rise request-recap"
    >
      <div className="image">
        <span className="fa fa-home fa-5x" />
      </div>
      <div className="text">
        <h3 className="fixed-size">{props.loanRequest.name || 'Sans Titre'}</h3>
        <p className="secondary">
          Progrès: 0%
        </p>
      </div>
    </Link>
  </article>
);

BorrowerOverview.propTypes = {
  loanRequest: PropTypes.arrayOf(PropTypes.any),
  borrowers: PropTypes.arrayOf(PropTypes.any),
};

BorrowerOverview.defaultProps = {
  borrowers: [],
  loanRequest: [],
};

export default BorrowerOverview;
