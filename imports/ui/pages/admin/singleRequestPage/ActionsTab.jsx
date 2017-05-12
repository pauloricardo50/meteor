import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import ConfirmMethod from './ConfirmMethod.jsx';
import { cancelAuction, finishAuction, deleteRequest } from '/imports/api/loanrequests/methods';

const styles = {
  div: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    margin: 8,
  },
};

const ActionsTab = props => {
  const serverTime = props.serverTime;

  const l = props.loanRequest.logic;

  return (
    <div style={styles.div}>
      <ConfirmMethod
        label="Annuler les enchères"
        keyword="ANNULER"
        method={cb => cancelAuction.call({ id: props.loanRequest._id }, cb)}
        style={styles.button}
        disabled={!(l.auctionStarted && serverTime && serverTime < l.auctionEndTime)}
      />
      <ConfirmMethod
        label="Terminer les enchères"
        keyword="TERMINER"
        method={cb => finishAuction.call({ id: props.loanRequest._id }, cb)}
        style={styles.button}
        disabled={!(l.auctionStarted && serverTime && serverTime < l.auctionEndTime)}
      />
      <ConfirmMethod
        label="Supprimer la demande"
        keyword="SUPPRIMER"
        method={cb =>
          deleteRequest.call({ id: props.loanRequest._id }, err => {
            if (!err) {
              window.location.href = '/admin';
            }
          })}
        style={styles.button}
      />
    </div>
  );
};

ActionsTab.propTypes = {};

export default ActionsTab;
