import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import LoanRequests from '/imports/api/loanrequests/loanrequests';
import Borrowers from '/imports/api/borrowers/borrowers';
import { generateComponentAsPDF } from '/imports/js/server/generate-pdf.js';
import { RequestPDF } from '/imports/api/loanrequests/pdf.js';
import { rateLimit } from './rate-limit.js';

Meteor.methods({
  getServerTime() {
    return new Date();
  },
});

export const downloadPDF = new ValidatedMethod({
  name: 'pdf.download',
  validate({ requestId }) {
    check(requestId, String);
  },
  run({ requestId }) {
    const loanRequest = LoanRequests.findOne({ _id: requestId });
    const borrowers = Borrowers.find({ _id: { $in: loanRequest.borrowers } });
    const fileName = `demande_${loanRequest.property.address1}.pdf`;
    return generateComponentAsPDF({
      component: RequestPDF,
      props: { loanRequest, borrowers },
      fileName,
    })
      .then(result => result)
      .catch(error => {
        throw new Meteor.Error('500', error);
      });
  },
});

rateLimit({
  methods: [downloadPDF],
  limit: 1,
  timeRange: 1000,
});
