import PropTypes from 'prop-types';
import React from 'react';

import Button from 'core/components/Button';
import { Link } from 'react-router-dom';

import { toMoney } from 'core/utils/conversionFunctions';
import Countdown from '/imports/ui/components/general/Countdown';

// Looks for an offer if it exists
const offerExists = props =>
  props.offers.some(offer => props.auction._id === offer.requestId);

const AuctionTableLine = props =>
  (<tr>
    <td className="left-align">
      <Countdown endTime={props.auction.auctionEndTime} />
    </td>
    <td className="left-align">
      {props.auction.type}
    </td>
    <td className="right-align">
      {`CHF ${toMoney(props.auction.value)}`}
    </td>
    <td className="right-align">
      <Button
        raised
        label={offerExists(props) ? 'Modifier mon offre' : 'Faire une offre'}
        primary={!!offerExists(props)}
        containerElement={<Link to={`/partner/${props.auction._id}`} />}
      />
    </td>
  </tr>);

AuctionTableLine.propTypes = {
  auction: PropTypes.objectOf(PropTypes.any).isRequired,
  offers: PropTypes.arrayOf(PropTypes.object),
};

AuctionTableLine.defaultProps = {
  offers: [],
};

export default AuctionTableLine;
