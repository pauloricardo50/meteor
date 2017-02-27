import { FlowRouter } from 'meteor/kadira:flow-router';
import cleanMethod from '/imports/api/cleanMethods';

const adminActions = (loanRequest) => {
  const now = new Date();

  const actions = [
    {
      name: 'Vérifier',
      condition: loanRequest.logic.auctionStarted &&
        !loanRequest.logic.auctionVerified &&
        (loanRequest.logic.auctionEndTime >= now),
      handleClick() {
        const id = loanRequest._id;
        const object = {
          'logic.auctionVerified': true,
        };
        cleanMethod('update', id, object, null, true);
      },
    }, {
      name: 'Ajouter une offre',
      condition: loanRequest.logic.auctionStarted &&
        loanRequest.logic.auctionVerified &&
        (loanRequest.logic.auctionEndTime >= now),
      handleClick() {
        FlowRouter.go(`/admin/requests/${loanRequest._id}/offers/new`);
        return null;
      },
    },
  ];

  return actions.filter(a => a.condition);
};

export default adminActions;
