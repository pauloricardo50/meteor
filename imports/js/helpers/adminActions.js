import moment from 'moment';
import Offers from '/imports/api/offers/offers';

const getConditions = loanRequest => {
  const now = new Date();
  const l = loanRequest.logic;
  return [
    {
      // case 0
      condition: l.verification && l.verification.requested === true,
    },
    {
      // case 1
      condition: l.auctionStarted && l.auctionVerified && l.auctionEndTime >= now,
    },
    {
      // case 2
      condition: l.lender && l.lender.offerId && !l.lender.contacted,
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
    case 2:
      return {
        name: 'Prêteur a été choisi',
        handleClick() {
          props.history.push(`/admin/requests/${loanRequest._id}/confirm-lender`);
        },
        small: `Date: ${moment(l.lender.chosenTime).format('D MMM H:mm:ss')}`,
        subtitle: Offers.find({ _id: l.lender.offerId }).organization,
        label: 'Connecter avec Prêteur',
      };
    default:
      return null;
  }
};

const adminActions = (loanRequest, props) => {
  moment().locale('fr-CH'); // TODO: This doesn't work

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
