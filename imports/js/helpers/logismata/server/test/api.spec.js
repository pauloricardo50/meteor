/* eslint-env mocha */
import { expect } from 'chai';
import { _ } from 'lodash';
import sinon from 'sinon';
import testRequire from '/imports/js/helpers/testHelpers/testRequire';

// import {
//   getAuthToken,
//   convertParamsToLogismata,
//   getParamsArray,
//   callApi,
//   getLocationId,
// } from '../../api';

const {
  getAuthToken,
  convertParamsToLogismata,
  getParamsArray,
  callApi,
  getLocationId,
} =
  testRequire('../../api') || require('../../api');

describe('logismata API', () => {
  describe('getAuthToken', () => {
    it('works', () =>
      getAuthToken()
        .then((token) => {
          expect(typeof token).to.equal('string');
          expect(token.length).to.equal(153);
        })
        .catch((e) => {
          throw e;
        }));

    it('fails if provided a wrong key', () =>
      getAuthToken('wrong_key').catch((e) => {
        expect(e.status).to.equal(400);
      }));
  });

  describe('convertParamsToLogismata', () => {
    it('returns an object with all default values', () => {
      expect(convertParamsToLogismata()).to.deep.equal({
        civilStatus: 2,
        confession: 'other',
        incomeBase: 1,
        sex: 1,
        country: 0,
        language: 0,
        mortgageType: 2,
        savingType: 1,
        existingOrNew: 1,
      });
    });

    it('converts a given object to logismata integers', () => {
      const obj = { sex: 'female' };
      expect(convertParamsToLogismata(obj)).to.deep.equal({
        civilStatus: 2,
        confession: 'other',
        incomeBase: 1,
        sex: 2,
        country: 0,
        language: 0,
        mortgageType: 2,
        savingType: 1,
        existingOrNew: 1,
      });
    });

    it('takes passes other values properly', () => {
      const obj = { test: 'test' };
      expect(convertParamsToLogismata(obj)).to.deep.equal({
        civilStatus: 2,
        confession: 'other',
        incomeBase: 1,
        sex: 1,
        country: 0,
        language: 0,
        mortgageType: 2,
        savingType: 1,
        existingOrNew: 1,
        test: 'test',
      });
    });

    it('throws if an incorrect value is provided', () => {
      const obj = { sex: 'test' };
      expect(() => convertParamsToLogismata(obj)).to.throw(
        'invalid logismata value provided',
      );
    });
  });

  describe('getParamsArray', () => {
    it('throws an error if an invalid method name is provided', () => {
      expect(() => getParamsArray('test', {})).to.throw('invalid logismata');
    });

    it('returns an array if a valid method is provided', () => {
      const methods = [
        'searchLocations',
        'calcIndirectAmortization',
        'calcDirectAmortization',
      ];

      methods.forEach((method) => {
        expect(_.isArray(getParamsArray(method, {}))).to.equal(true);
      });
    });
  });

  describe('callApi', () => {
    it('throws if an invalid method is given', () => {
      expect(() => callApi('test')).to.throw('invalid logismata method name');
      // callApi('test').catch(e =>
      //   expect(e.message).to.deep.equal('invalid logismata method name'),
      // );
    });

    it('works with a simple query', () => {
      const params = {
        search: '1400 Yverdon-les-bains',
        country: 'CH',
        language: 'all',
      };
      return callApi('searchLocations', params).then((result) => {
        expect(result.errorCode).to.equal(0);
        expect(result.response).to.deep.equal([
          {
            state: 'VD',
            id: 140000000,
            zip: 1400,
            city: 'Yverdon-les-Bains',
            dist: 0,
          },
        ]);
      });
    });
  });

  describe('getLocationId', () => {
    it('returns a correct id for yverdon', () =>
      getLocationId('1400 Yverdon-les-bains').then(id =>
        expect(id).to.equal(140000000),
      ));
  });
});
