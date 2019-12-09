// @flow
/* eslint-env-mocha */
import { expect } from 'chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';

import { up, down } from '../29';
import BorrowerService from '../../../borrowers/server/BorrowerService';

describe('Migration 29', () => {
    beforeEach(() => {
        resetDatabase();
    });

    describe('up', () => {
        it('migrates bankFortune to an array', async () => {
            await BorrowerService.rawCollection.insert({
                _id: 'b1',
                bankFortune: 1000,
            });

            await BorrowerService.rawCollection.insert({
                _id: 'b2',
            });

            await up();

            const borrowers = BorrowerService.fetch({ bankFortune: 1 });

            expect(borrowers[0].bankFortune.length).to.equal(1);
            expect(borrowers[0].bankFortune[0]).to.deep.include({ value: 1000 });
            expect(borrowers[1].bankFortune).to.equal(undefined);
        });
    });

    describe('down', () => {
        it('migrates bankFortune back to a single value', async () => {
            await BorrowerService.rawCollection.insert({
                _id: 'b1',
                bankFortune: [
                    { value: 1000, description: 'Test' },
                    { value: 2000, description: 'Test 2' },
                ],
            });

            await BorrowerService.rawCollection.insert({
                _id: 'b2',
            });

            await down();

            const borrowers = BorrowerService.fetch({ bankFortune: 1 });

            expect(borrowers[0].bankFortune).to.equal(3000);
            expect(borrowers[1].bankFortune).to.equal(undefined);
        });
    });
});
