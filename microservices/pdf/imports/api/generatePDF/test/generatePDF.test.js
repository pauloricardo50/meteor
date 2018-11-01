/* eslint-env mocha */
import { Meteor } from 'meteor/meteor';

import { expect } from 'chai';
import { PDF_TYPES } from 'core/api/constants';

describe('generatePDF', () => {
  it('return an error if data is not provided', (done) => {
    Meteor.call('_generatePDF', {}, (error) => {
      expect(error.message).to.include('Match error');
      done();
    });
  });

  it('return an error if data is not an object', (done) => {
    Meteor.call('_generatePDF', { data: () => null }, (error) => {
      expect(error.message).to.include('Match error');
      done();
    });
  });

  it('return an error if options is not an object', (done) => {
    Meteor.call(
      '_generatePDF',
      { data: {}, type: PDF_TYPES.ANONYMOUS_LOAN, options: () => null },
      (error) => {
        expect(error.message).to.include('Match error');
        done();
      },
    );
  });
});
