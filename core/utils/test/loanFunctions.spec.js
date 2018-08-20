/* eslint-env mocha */
import { expect } from 'chai';
import moment from 'moment';

import { getAuctionEndTime, formatLoanWithStructure } from '../loanFunctions';

describe('Loan functions', () => {
  describe('getAuctionEndTime', () => {
    let endDate;

    beforeEach(() => {
      endDate = moment()
        .year(2017)
        .month(0)
        .hours(23)
        .minutes(59)
        .seconds(59)
        .milliseconds(0);
    });

    it('Should return wednesday night for a monday afternoon', () => {
      // Jan 2nd 2017, a monday
      const date = moment()
        .year(2017)
        .month(0)
        .date(2)
        .hours(14);
      endDate.date(4);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return monday night for a thursday afternoon', () => {
      // Jan 5th 2017, a thursday
      const date = moment()
        .year(2017)
        .month(0)
        .date(5)
        .hours(14);
      endDate.date(9);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a friday afternoon', () => {
      // Jan 6th 2017, a friday
      const date = moment()
        .year(2017)
        .month(0)
        .date(6)
        .hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a monday early morning', () => {
      // Jan 2nd 2017, a monday
      const date = moment()
        .year(2017)
        .month(0)
        .date(2)
        .hours(5);
      endDate.date(3);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a saturday afternoon', () => {
      // Jan 7th 2017, a saturday
      const date = moment()
        .year(2017)
        .month(0)
        .date(7)
        .hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a saturday early morning', () => {
      // Jan 7th 2017, a saturday
      const date = moment()
        .year(2017)
        .month(0)
        .date(7)
        .hours(5);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a sunday afternoon', () => {
      // Jan 8th 2017, a sunday
      const date = moment()
        .year(2017)
        .month(0)
        .date(8)
        .hours(14);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });

    it('Should return Tuesday night for a sunday early morning', () => {
      // Jan 8th 2017, a sunday
      const date = moment()
        .year(2017)
        .month(0)
        .date(8)
        .hours(5);
      endDate.date(10);

      expect(getAuctionEndTime(date).getTime()).to.equal(endDate.toDate().getTime());
    });
  });

  describe('formatLoanWithStructure', () => {
    it('sets the right structure', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test',
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.include({ id: 'test', hello: 'world' });
    });

    it('adds an empty structure if the structure was not found', () => {
      expect(formatLoanWithStructure({
        selectedStructure: 'test2',
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.include({});
    });

    it('adds an empty structure if selectedStructure is not defined', () => {
      expect(formatLoanWithStructure({
        structures: [{ id: 'test', hello: 'world' }],
      })).to.deep.equal({});
    });

    it('adds the right property if it exists', () => {
      expect(formatLoanWithStructure({
        properties: [{ _id: 'property1', value: 100 }],
        selectedStructure: 'test',
        structures: [{ id: 'test', propertyId: 'property1' }],
      })).to.deep.include({
        id: 'test',
        propertyId: 'property1',
        property: { _id: 'property1', value: 100 },
      });
    });

    it('adds the right offer if it exists', () => {
      expect(formatLoanWithStructure({
        offers: [{ _id: 'offer1', amortization: 100 }],
        selectedStructure: 'test',
        structures: [{ id: 'test', offerId: 'offer1' }],
      })).to.deep.include({
        id: 'test',
        offerId: 'offer1',
        offer: { _id: 'offer1', amortization: 100 },
      });
    });

    it('adds both offer and property', () => {
      expect(formatLoanWithStructure({
        offers: [{ _id: 'offer1', amortization: 100 }],
        properties: [{ _id: 'property1', value: 100 }],
        selectedStructure: 'test',
        structures: [
          { id: 'test', offerId: 'offer1', propertyId: 'property1' },
        ],
      })).to.deep.include({
        id: 'test',
        offerId: 'offer1',
        propertyId: 'property1',
        offer: { _id: 'offer1', amortization: 100 },
        property: { _id: 'property1', value: 100 },
      });
    });
  });
});
