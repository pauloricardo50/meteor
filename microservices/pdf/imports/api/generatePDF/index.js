import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';
import PDFService from './PDFService';

Meteor.methods({
  _generatePDF({ data, type, options }) {
    check(data, Object);
    check(type, String);
    check(options, Match.Optional(Object));
    return PDFService.generateDataAsPDF({ data, type, options });
  },
});
