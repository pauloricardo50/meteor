import moment from 'moment';
import Offers from '/imports/api/offers/offers';

const getConditions = loanRequest => {
  const now = new Date();
  const l = loanRequest.logic;
  return [
    {
      condition: l.verification && l.verification.requested === true,
    },
    {
      condition: l.auctionStarted && l.auctionVerified && l.auctionEndTime >= now,
    },
  ];
};

const getActions = (loanRequest, props, i) => {
  const l = loanRequest.logic;

  switch (i) {
    case 0:
      return {
        name: 'Vérification demandée',
        handleClick() {
          console.log(`${location.origin}/admin/requests/${loanRequest._id}/verify`);
          window.open(
            `${location.origin}/admin/requests/${loanRequest._id}/verify`,
            '_blank',
            'width=500',
          );
        },
        small: !!l.verification &&
          `Date: ${moment(l.verification.requestedTime).format('D MMM H:mm:ss')}`,
        label: 'Vérifier',
      };
    case 1:
      return {
        name: 'Enchères en cours',
        handleClick() {
          window.open(
            `${location.host}/admin/requests/${loanRequest._id}/offers/new`,
            '',
            'width=500',
          );
        },
        small: `Fin des enchères: ${moment(l.auctionEndTime).format('D MMM H:mm:ss')}`,
        subtitle: `${Offers.find({ requestId: loanRequest._id }).count()} Offre(s)`,
        label: 'Ajouter une offre',
      };
    default:
      return null;
  }
};

const adminActions = (loanRequest, props) => {
  moment().locale('fr-CH');

  const conditions = getConditions(loanRequest);

  const actions = [];

  // Check each condition on the request
  conditions.forEach((c, i) => {
    if (c.condition) {
      // If a condition is true, evaluate and get the desired action object
      actions.push(getActions(loanRequest, props, i));
    }
  });

  return actions;
};

export default adminActions;
