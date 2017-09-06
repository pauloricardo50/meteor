import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import Button from '/imports/ui/components/general/Button.jsx';

const OfferTableLine = props =>
  <tr>
    <td className="l">
      {moment(props.offer.auctionEndTime).format('MMM. D, YYYY')}
    </td>
    <td className="l">hehe</td>
    <td className="r">haha</td>
    <td className="r">
      <Button
        label="Voir l'offre"
        onClick={() => console.log('develop this')}
      />
    </td>
  </tr>;

OfferTableLine.propTypes = {
  offer: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default OfferTableLine;
