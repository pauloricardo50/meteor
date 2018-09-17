/* eslint-env mocha */
import { expect } from 'chai';
import { PDF_ERRORS } from '../constants';

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
});
