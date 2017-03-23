import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

export default class PropertyOverview extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article>
        <div className="requests">
          {this.props.loanRequests.map(request => (
            <div
              // to={`/app/borrowers/${borrower._id}`}
              className="mask1 animated fadeIn hover-rise request-recap"
              key={request._id}
            >
              <div className="image">
                <span className="fa fa-home fa-5x" />
              </div>
              <div className="text">
                <h3>{request.property.address1 || 'Sans Titre'}</h3>
                <p className="secondary">
                  Progrès: 0%
                </p>
              </div>
            </div>
          ))}
        </div>
      </article>
    );
  }
}

PropertyOverview.propTypes = {
  loanRequests: PropTypes.arrayOf(PropTypes.any),
};

PropertyOverview.defaultProps = {
  loanRequests: [],
};
