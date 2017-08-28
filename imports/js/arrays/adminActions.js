import moment from 'moment';
import Offers from '/imports/api/offers/offers';

const getActions = [
  {
    id: 'verify',
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}?tab=forms`);
      window.open(
        `${location.origin}/admin/requests/${loanRequest._id}/verify`,
        '_blank',
        'width=700, height=700',
      );
    },
  },
  {
    id: 'auction',
    comment: loanRequest =>
      `Fin: ${moment(loanRequest.logic.auction.endTime).format(
        'D MMM H:mm:ss',
      )}, Offres: ${Offers.find({
        requestId: loanRequest._id,
      }).count()}`,
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}`);
    },
  },
  {
    id: 'lenderChosen',
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}/contactlenders`);
    },
  },
  {
    id: 'addFinalSteps',
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}/finalsteps`);
    },
  },
  {
    id: 'verifyFinalSteps',
    comment: () => 'Contrat 0%, Décaissement: 0%', // TODO
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}?tab=files`);
    },
  },
  {
    id: 'requestContract',
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}?tab=actions`);
    },
  },
  {
    id: 'uploadContract',
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}?tab=actions`);
    },
  },
  {
    id: 'confirmClosing',
    handleClick: (loanRequest, pushToHistory) => {
      pushToHistory(`/admin/requests/${loanRequest._id}?tab=actions`);
    },
  },
];

export default getActions;
