import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import LoanRequests from 'core/api/loanrequests/loanrequests';
import Borrowers from 'core/api/borrowers/borrowers';
import { generateComponentAsPDF } from '/imports/js/server/generate-pdf.js';
import {
  RequestPDF,
  AnonymousRequestPDF,
} from 'core/api/loanrequests/pdf.js';
import rateLimit from '../../utils/rate-limit.js';

Meteor.methods({
  getServerTime: () => new Date(),
});

export const downloadPDF = new ValidatedMethod({
  name: 'pdf.download',
  validate({ requestId, type }) {
    check(requestId, String);
    check(type, String);
  },
  run({ requestId, type }) {
    const loanRequest = LoanRequests.findOne(requestId);
    const borrowers = Borrowers.find({ _id: { $in: loanRequest.borrowers } });
    const prefix = type === 'anonymous' ? 'Anonyme' : 'Complet';
    const fileName = `${prefix} ${loanRequest.property.address1}.pdf`;

    // If type is anonymous, request the anonymous pdf
    const component = type === 'anonymous' ? AnonymousRequestPDF : RequestPDF;

    return generateComponentAsPDF({
      component,
      props: { loanRequest, borrowers },
      fileName,
    })
      .then(result => result)
      .catch((error) => {
        throw new Meteor.Error('500', error);
      });
  },
});

rateLimit({ methods: [downloadPDF] });
