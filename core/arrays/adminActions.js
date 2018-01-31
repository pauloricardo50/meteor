import moment from 'moment';
import { Offers, constants } from 'core/api';

const { ADMIN_ACTION_TYPE } = constants;

const getActions = [
  {
    id: ADMIN_ACTION_TYPE.VERIFY,
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}?tab=forms`);
      window.open(
        `${location.origin}/loans/${loan._id}/verify`,
        '_blank',
        'width=700, height=700',
      );
    },
  },
  {
    id: ADMIN_ACTION_TYPE.AUCTION,
    comment: loan =>
      `Fin: ${moment(loan.logic.auction.endTime).format('D MMM H:mm:ss')}, Offres: ${Offers.find({
        loanId: loan._id,
      }).count()}`,
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}`);
    },
  },
  {
    id: ADMIN_ACTION_TYPE.LENDER_CHOSEN,
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}/contactlenders`);
    },
  },
  {
    id: 'addFinalSteps',
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}/finalsteps`);
    },
  },
  {
    id: 'verifyFinalSteps',
    comment: () => 'Contrat 0%, Décaissement: 0%', // TODO
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}?tab=files`);
    },
  },
  {
    id: 'loanContract',
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}?tab=actions`);
    },
  },
  {
    id: 'uploadContract',
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}?tab=actions`);
    },
  },
  {
    id: 'confirmClosing',
    handleClick: (loan, pushToHistory) => {
      pushToHistory(`/loans/${loan._id}?tab=actions`);
    },
  },
];

export default getActions;
