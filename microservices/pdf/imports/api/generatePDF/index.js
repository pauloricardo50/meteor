import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import { PDF_TYPES, PDF_ERRORS } from './constants';
import PDFService from './PDFService';

Meteor.methods({
  generatePDF({ data, type, options }) {
    console.log('type', type);
    check(data, Object);
    check(type, String);
    check(options, Match.Optional(Object));
    if (!Object.values(PDF_TYPES).includes(type)) {
      console.log('sdihfhdsfkjhkdfhjksdfhjksd');
      throw new Meteor.Error(PDF_ERRORS.WRONG_TYPE);
    }
    return PDFService.generateDataAsPDF({ data, type, options });
  },
});
