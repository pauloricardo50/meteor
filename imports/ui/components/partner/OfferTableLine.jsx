import React, { PropTypes } from 'react';
import moment from 'moment';

import FlatButton from 'material-ui/FlatButton';

const OfferTableLine = props => (
  <tr>
    <td className="left-align">
      {moment(props.offer.auctionEndTime).format('MMM. D, YYYY')}
    </td>
    <td className="left-align">hehe</td>
    <td className="right-align">haha</td>
    <td className="right-align">
      <FlatButton
        label="Voir l'offre"
        onTouchTap={() => console.log('develop this')}
      />
    </td>
  </tr>
);

OfferTableLine.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OfferTableLine;
