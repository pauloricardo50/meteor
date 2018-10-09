/* eslint-env mocha */
import { expect } from 'chai';
import { PDF_ERRORS, PDF_TYPES } from '../constants';

describe('generatePDF', () => {
  it('return an error if data is not provided', (done) => {
    Meteor.call('generatePDF', {}, (error) => {
      expect(error.message).to.include('Match error');
      done();
    });
  });

  it('return an error if data is not an object', (done) => {
    Meteor.call('generatePDF', { data: () => null }, (error) => {
      expect(error.message).to.include('Match error');
      done();
    });
  });

  it('return an error if options is not an object', (done) => {
    Meteor.call(
      'generatePDF',
      { data: {}, type: PDF_TYPES.LOAN_BANK, options: () => null },
      (error) => {
        expect(error.message).to.include('Match error');
        done();
      },
    );
  });

  it('return an error if type is unknown', (done) => {
    Meteor.call(
      'generatePDF',
      {
        type: 'whatever',
        data: {},
      },
      (error) => {
        expect(error.message).to.include(PDF_ERRORS.WRONG_TYPE);
        done();
      },
    );
  });

  it('return an error if type is unknown', (done) => {
    Meteor.call(
      'generatePDF',
      {
        type: PDF_TYPES.LOAN_BANK,
        data: {},
      },
      (error) => {
        expect(error.message).to.include(PDF_ERRORS.WRONG_TYPE);
        done();
      },
    );
  });
});
