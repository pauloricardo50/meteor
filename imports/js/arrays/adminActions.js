import moment from 'moment';
import Offers from '/imports/api/offers/offers';
import { downloadPDF } from '/imports/js/helpers/download-pdf';

/**
 * getActions - Returns an array of possible admin actions depending on
 * the current step of the loan request
 *
 * @param {Object} loanRequest   A single loan request, from which we
 * extract the possible actions
 * @param {Object} pushToHistory props.history.push, to alter the current url
 *
 * @return {Array<Object>} The admin actions, which have an id, a condition and
 * rendering values
 */
const getActions = (loanRequest, pushToHistory) => {
  const now = new Date();
  const l = loanRequest.logic;

  if (l.done) {
    return [];
  } else if (l.step <= 1) {
    return [
      {
        id: 'verify',
        condition: l.verification && l.verification.requested === true,
        title: () => 'Vérifier dossier',
        date: () => l.verification.requestedTime,
        handleClick: () => {
          pushToHistory(`/admin/requests/${loanRequest._id}?tab=forms`);
          window.open(
            `${location.origin}/admin/requests/${loanRequest._id}/verify`,
            '_blank',
            'width=700, height=700',
          );
        },
      },
    ];
  } else if (l.step <= 2) {
    return [
      {
        id: 'auction',
        condition: l.auctionStarted && l.auctionEndTime >= now,
        title: () => 'Enchères en cours',
        date: () => l.auctionStartTime,
        comment: () =>
          `Fin: ${moment(l.auctionEndTime).format('D MMM H:mm:ss')}, Offres: ${Offers.find({
            requestId: loanRequest._id,
          }).count()}`,
        handleClick: () => {
          pushToHistory(`/admin/requests/${loanRequest._id}`);
        },
      },
      {
        id: 'lenderChosen',
        condition: l.lender && l.lender.offerId && !l.lender.contacted,
        title: () => 'Prêteur a été choisi',
        date: () => l.lender.chosenTime,
        handleClick: () => {
          pushToHistory(`/admin/requests/${loanRequest._id}/contactlenders`);
        },
      },
    ];
  }

  return [
    {
      id: 'lenderChosen',
      condition: l.lender && l.lender.offerId && !l.lender.contacted,
      title: () => 'Prêteur a été choisi',
      date: () => l.lender.chosenTime,
      handleClick: () => {
        pushToHistory(`/admin/requests/${loanRequest._id}/contactlenders`);
      },
    },
    {
      id: 'addFinalSteps',
      condition: l.lender.contacted && !l.finalStepsAdded,
      title: () => 'Transmettre réponse du prêteur',
      date: () => l.lender.contactedTime,
      handleClick: () => {
        pushToHistory(`/admin/requests/${loanRequest._id}/finalsteps`);
      },
    },
    {
      id: 'verifyFinalSteps',
      condition: l.finaleStepsAdded && !l.done,
      title: () => 'Vérifier les derniers documents',
      date: () => l.finalStepsAddedTime,
      comment: () => 'Contrat 0%, Décaissement: 0%', // TODO
      handleClick: () => {
        pushToHistory(`/admin/requests/${loanRequest._id}?tab=files`);
      },
    },
    {
      id: 'requestContract',
      condition: l.contractRequested && !l.contract,
      title: () => 'Demander le contrat',
      handleClick: () => {
        pushToHistory(`/admin/requests/${loanRequest._id}?tab=actions`);
      },
    },
    {
      id: 'uploadContract',
      condition: l.lender.contractRequested && l.lender.contractRequestSent && !l.lender.contract,
      title: () => 'Uploader le contrat',
      handleClick: () => {
        pushToHistory(`/admin/requests/${loanRequest._id}?tab=actions`);
      },
    },
    {
      id: 'confirmClosing',
      condition: l.lender.contract && !l.done,
      title: () => 'Confirmer le décaissement',
      handleClick: () => {
        pushToHistory(`/admin/requests/${loanRequest._id}?tab=actions`);
      },
    },
  ];
};

/**
 * adminActions - Filters out the actions from a request that need
 * to be done
 *
 * @param {Object} loanRequest Description
 * @param {Object} props       Description
 *
 * @return {Array<Object>} Description
 */
const adminActions = (loanRequest, pushToHistory) =>
  getActions(loanRequest, pushToHistory)
    .filter(a => !!a.condition)
    .map(a => ({ ...a, requestId: loanRequest._id, requestName: loanRequest.name }));

export default adminActions;
