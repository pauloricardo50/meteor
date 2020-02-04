//      
/* eslint-env mocha */
import { expect } from 'chai';

import { createBodyFromMap, mapData } from '../analysisHelpers';

describe('analysisHelpers', () => {
  describe('createBodyFromMap', () => {
    it('creates a query body from a map', () => {
      const body = createBodyFromMap({
        hello: {},
        'world.hello': {},
      });

      expect(body).to.deep.equal({
        hello: 1,
        world: { hello: 1 },
      });
    });

    it('uses a fragment if provided', () => {
      const body = createBodyFromMap({
        hello: { fragment: { dude: 1, mate: 1 } },
        'world.hello': {},
      });

      expect(body).to.deep.equal({
        hello: { dude: 1, mate: 1 },
        world: { hello: 1 },
      });
    });

    it('merges multiple fragments', () => {
      const body = createBodyFromMap({
        'world.hello': {},
        'world.yo': {},
      });

      expect(body).to.deep.equal({
        world: { hello: 1, yo: 1 },
      });
    });

    it('only allows one fragment in an array description', () => {
      expect(() =>
        createBodyFromMap({
          'world.hello': [{ fragment: { yo: 1 } }, { fragment: { dude: 1 } }],
        }),
      ).to.throw('only have one');
    });

    it('does not allow fragments in subsequent items in an array', () => {
      expect(() =>
        createBodyFromMap({
          'world.hello': [{}, { fragment: { dude: 1 } }],
        }),
      ).to.throw('only have one');
    });
  });

  describe('mapData', () => {
    it('removes unnecessary keys', () => {
      const data = [{ yo: 'wut', hey: 'mate' }];
      const map = { yo: { label: 'dude' } };

      const result = mapData({ data, map });

      expect(result).to.deep.equal([{ dude: 'wut' }]);
    });

    it('formats data in a new way', () => {
      const data = [{ yo: 'wut', hey: 'mate' }];
      const map = { yo: { label: 'dude', format: () => 2 } };

      const result = mapData({ data, map });

      expect(result).to.deep.equal([{ dude: 2 }]);
    });

    it('formats data in a new way, multiple times', () => {
      const data = [{ yo: 'wut', hey: 'mate' }];
      const map = {
        yo: [
          { label: 'dude', format: () => 2 },
          { label: 'dude2', format: ({ yo }) => yo + 2 },
        ],
      };

      const result = mapData({ data, map });

      expect(result).to.deep.equal([{ dude: 2, dude2: 'wut2' }]);
    });
  });
});
