import React, { PropTypes } from 'react';
import cleanMethods from '/imports/api/cleanMethods';

import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';

export default class BorrowerOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  handleAdd() {
    cleanMethods('insertBorrower', {});
  }

  render() {
    return (
      <article className="borrowers">
        {this.props.borrowers.map((borrower, i) => (
          <Link
            to={`/app/borrowers/${borrower._id}`}
            className="mask1 hover-rise animated fadeIn borrower-recap"
            key={borrower._id}
          >
            <div className="image">
              <span className="fa fa-user-circle-o fa-5x" />
            </div>
            <div className="text">
              <h3>{borrower.firstName || `Emprunteur ${i + 1}`}</h3>
              <p className="secondary">
                Progrès: 0%
              </p>
            </div>
          </Link>
        ))}
        <a className="mask2 new-borrower" onTouchTap={this.handleAdd}>
          <h1>+</h1>
          <h4 className="bold">Ajouter un emprunteur</h4>
        </a>
      </article>
    );
  }
}

BorrowerOverview.propTypes = {
  borrowers: PropTypes.arrayOf(PropTypes.any),
};

BorrowerOverview.defaultProps = {
  borrowers: [],
};
