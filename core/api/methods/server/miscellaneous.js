import { Meteor } from 'meteor/meteor';
import btoa from 'btoa';
import { Roles } from 'meteor/alanning:roles';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import Loans from '../../loans/loans';
import Borrowers from '../../borrowers/borrowers';

import { generateComponentAsPDF } from '../../../utils/generate-pdf';
import { LoanPDF, AnonymousLoanPDF } from '../../loans/pdf.js';
import rateLimit from '../../../utils/rate-limit.js';

Meteor.methods({
    getServerTime: () => new Date(),
    getMixpanelAuthorization() {
        if (
            Roles.userIsInRole(Meteor.userId(), 'dev') ||
            Roles.userIsInRole(Meteor.userId(), 'admin')
        ) {
            const API_KEY = Meteor.settings.MIXPANEL_API_KEY;
            const API_SECRET = Meteor.settings.MIXPANEL_API_SECRET;

            return `Basic ${btoa(`${API_SECRET}:${API_KEY}`)}`;
        }

        throw new Meteor.Error(
            'Unauthorized access to getMixpanelAuthorization'
        );
    }
});

export const downloadPDF = new ValidatedMethod({
    name: 'pdf.download',
    validate({ loanId, type }) {
        check(loanId, String);
        check(type, String);
    },
    run({ loanId, type }) {
        const loan = Loans.findOne(loanId);
        const borrowers = Borrowers.find({ _id: { $in: loan.borrowerIds } });
        const prefix = type === 'anonymous' ? 'Anonyme' : 'Complet';
        const fileName = `${prefix} ${loan.propertyId.address1}.pdf`;

        // If type is anonymous, loan the anonymous pdf
        const component = type === 'anonymous' ? AnonymousLoanPDF : LoanPDF;

        return generateComponentAsPDF({
            component,
            props: { loan, borrowers },
            fileName
        })
            .then(result => result)
            .catch(error => {
                throw new Meteor.Error('500', error);
            });
    }
});

rateLimit({ methods: [downloadPDF] });
