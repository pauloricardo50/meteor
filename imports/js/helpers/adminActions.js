const adminActions = (loanRequest, props) => {
  const now = new Date();

  const actions = [
    {
      name: 'Vérifier',
      condition: loanRequest.logic.verification.requested,
      handleClick() {
        props.history.push(`/admin/requests/${loanRequest._id}/verify`);
      },
    },
    {
      name: 'Ajouter une offre',
      condition: loanRequest.logic.auctionStarted &&
        loanRequest.logic.auctionVerified &&
        loanRequest.logic.auctionEndTime >= now,
      handleClick() {
        props.history.push(`/admin/requests/${loanRequest._id}/offers/new`);
        return null;
      },
    },
  ];

  return actions.filter(a => a.condition);
};

export default adminActions;
