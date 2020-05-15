import { Meteor } from 'meteor/meteor';

import React, { useState } from 'react';
import { expect } from 'chai';

import { INTEREST_RATES_COLLECTION } from '../../../api/interestRates/interestRatesConstants';
import { interestRates } from '../../../api/interestRates/queries';
import { ROLES } from '../../../api/users/userConstants';
import { resetDatabase, userLogin } from '../../../utils/testHelpers';
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from '../../../utils/testHelpers/testing-library';
import usePaginatedMeteorData from '../../usePaginatedMeteorData';

const callMethod = (name, ...args) =>
  new Promise(resolve =>
    Meteor.call(name, ...args, (err, res) => resolve(res)),
  );

const TestComponent = ({ query, params }) => {
  const [pageSize, setPageSize] = useState(10);
  const {
    data = [],
    totalCount,
    nextPage,
    hasMoreResults,
    page,
    loading,
    setPage,
  } = usePaginatedMeteorData({
    query,
    params,
    pageSize,
  });

  return (
    <div>
      <span>dataPoint: {data[0]?._id}</span>
      <span>data: {data.length}</span>
      <span>totalCount: {totalCount}</span>
      <span>page: {page}</span>
      <span>loading: {`${loading}`}</span>
      <span>hasMoreResults: {`${hasMoreResults}`}</span>
      <button type="button" onClick={() => setPageSize(15)}>
        set pageSize
      </button>
      <button type="button" onClick={() => nextPage()}>
        next page
      </button>
      <button type="button" onClick={() => setPage(2)}>
        go to page 2
      </button>
    </div>
  );
};

describe.only('usePaginatedMeteorData', () => {
  beforeEach(() => {
    cleanup();
    // Important, hard earned, lesson: Calling resetDatabase on the client resets the websocket
    // connection. This can make methods fail, as the result of a called method
    // will never reach the client back

    // Take a look at the network tab, you should see 2 websocket connections,
    // 1 for the current microservice, and another for backend
    // if you see a third, you're having issues
    return callMethod('resetDatabase');
  });

  describe('named queries', () => {
    it('returns paginated data', async () => {
      await callMethod('generateScenario', {
        scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
      });
      const { getByText } = render(
        <TestComponent query={interestRates} params={{ $body: { _id: 1 } }} />,
      );

      await waitFor(() => expect(!!getByText('data: 10')).to.equal(true));
      await waitFor(() => expect(!!getByText('totalCount: 25')).to.equal(true));
    });

    it('changes pageSize', async () => {
      await callMethod('generateScenario', {
        scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
      });
      const { getByText } = render(
        <TestComponent query={interestRates} params={{ $body: { _id: 1 } }} />,
      );

      await waitFor(() => expect(!!getByText('data: 10')).to.equal(true));

      fireEvent.click(getByText('set pageSize'));

      await waitFor(() => expect(!!getByText('data: 15')).to.equal(true));
    });

    it('goes to the next page', async () => {
      await callMethod('generateScenario', {
        scenario: {
          interestRates: Array.from({ length: 25 }, (_, i) => ({
            _id: `${i}`,
          })),
        },
      });
      const { getByText } = render(
        <TestComponent query={interestRates} params={{ $body: { _id: 1 } }} />,
      );

      await waitFor(() => expect(!!getByText('dataPoint: 0')).to.equal(true));
      await waitFor(() =>
        expect(!!getByText('hasMoreResults: true')).to.equal(true),
      );

      fireEvent.click(getByText('next page'));

      await waitFor(() => expect(!!getByText('dataPoint: 10')).to.equal(true));

      fireEvent.click(getByText('next page'));

      await waitFor(() => expect(!!getByText('dataPoint: 20')).to.equal(true));

      // Should not go to page 3
      fireEvent.click(getByText('next page'));

      await waitFor(() =>
        expect(!!getByText('hasMoreResults: false')).to.equal(true),
      );
      expect(!!getByText('dataPoint: 20')).to.equal(true);
    });

    it('loads a specific page', async () => {
      await callMethod('generateScenario', {
        scenario: {
          interestRates: Array.from({ length: 25 }, (_, i) => ({
            _id: `${i}`,
          })),
        },
      });
      const { getByText } = render(
        <TestComponent query={interestRates} params={{ $body: { _id: 1 } }} />,
      );

      await waitFor(() => expect(!!getByText('dataPoint: 0')).to.equal(true));

      fireEvent.click(getByText('go to page 2'));

      await waitFor(() => expect(!!getByText('dataPoint: 20')).to.equal(true));
      expect(!!getByText('hasMoreResults: false')).to.equal(true);
    });
  });

  describe('global queries', () => {
    beforeEach(async () => {
      await new Promise(res => Meteor.logout(res));
      await userLogin({ role: ROLES.ADMIN });
    });

    afterEach(async () => {
      await new Promise(res => Meteor.logout(res));
    });

    it('loads', async () => {
      await callMethod('generateScenario', {
        scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
      });
      const { getByText } = render(
        <TestComponent query={INTEREST_RATES_COLLECTION} params={{ _id: 1 }} />,
      );

      await waitFor(() => expect(!!getByText('data: 10')).to.equal(true));
      await waitFor(() => expect(!!getByText('totalCount: 25')).to.equal(true));
    });

    it('changes pageSize', async () => {
      await callMethod('generateScenario', {
        scenario: { interestRates: Array.from({ length: 25 }, () => ({})) },
      });
      const { getByText } = render(
        <TestComponent query={INTEREST_RATES_COLLECTION} params={{ _id: 1 }} />,
      );

      await waitFor(() => expect(!!getByText('data: 10')).to.equal(true));

      fireEvent.click(getByText('set pageSize'));

      await waitFor(() => expect(!!getByText('data: 15')).to.equal(true));
    });

    it('goes to the next page', async () => {
      await callMethod('generateScenario', {
        scenario: {
          interestRates: Array.from({ length: 25 }, (_, i) => ({
            _id: `${i}`,
          })),
        },
      });
      const { getByText } = render(
        <TestComponent query={INTEREST_RATES_COLLECTION} params={{ _id: 1 }} />,
      );

      await waitFor(() => expect(!!getByText('dataPoint: 0')).to.equal(true));
      await waitFor(() =>
        expect(!!getByText('hasMoreResults: true')).to.equal(true),
      );

      fireEvent.click(getByText('next page'));

      await waitFor(() => expect(!!getByText('dataPoint: 10')).to.equal(true));

      fireEvent.click(getByText('next page'));

      await waitFor(() => expect(!!getByText('dataPoint: 20')).to.equal(true));

      // Should not go to page 3
      fireEvent.click(getByText('next page'));

      await waitFor(() =>
        expect(!!getByText('hasMoreResults: false')).to.equal(true),
      );
      expect(!!getByText('dataPoint: 20')).to.equal(true);
    });
  });
});
