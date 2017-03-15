import React, { Component, PropTypes } from 'react';
import moment from 'moment';

import RaisedButton from 'material-ui/RaisedButton';

export default class TodoItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="mask1 admin-todo">
        <div className="text">
          <h3 className="fixed-size">
            {this.props.request.property.address1}
            &nbsp;-&nbsp;
            <small>
              Fin des enchères:&nbsp;
              {moment(this.props.request.logic.auctionEndTime).format(
                'D MMM hh:mm:ss',
              )}
            </small>
          </h3>

          {true &&
            <p>
              {this.props.offers.length} Offres
            </p>}
        </div>

        <RaisedButton
          label={
            (this.props.verify && 'Vérifier') ||
              (this.props.auction && 'Ajouter une offre')
          }
          href={`/admin/requests/${this.props.request._id}`}
          primary
        />
      </article>
    );
  }
}

TodoItem.defaultProps = {
  offers: [],
  verify: false,
  auction: false,
};

TodoItem.propTypes = {
  request: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
  verify: PropTypes.bool,
  auction: PropTypes.bool,
};
