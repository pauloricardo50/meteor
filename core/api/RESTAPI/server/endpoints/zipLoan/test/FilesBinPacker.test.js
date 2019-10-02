/* eslint-env mocha */
import { expect } from 'chai';

import FilesBinPacker from '../FilesBinPacker';

describe('FilesBinPacker', () => {
  it('packs files in bins', () => {
    const files = [
      { Key: '1.pdf', Size: 8 },
      { Key: '2.pdf', Size: 7 },
      { Key: '3.pdf', Size: 4 },
      { Key: '4.pdf', Size: 3 },
      { Key: '5.pdf', Size: 1 },
      { Key: '6.pdf', Size: 1 },
      { Key: '7.pdf', Size: 5 },
      { Key: '8.pdf', Size: 5 },
      { Key: '9.pdf', Size: 2 },
    ];
    const filesBinPacker = new FilesBinPacker(files, (10 * 14) / 10);
    filesBinPacker.packFiles();
    expect(filesBinPacker.bins.length).to.equal(4);
    expect(filesBinPacker.getFilesBinIndex()).to.deep.equal([
      { Key: '1.pdf', binIndex: 0 },
      { Key: '2.pdf', binIndex: 1 },
      { Key: '3.pdf', binIndex: 3 },
      { Key: '4.pdf', binIndex: 1 },
      { Key: '5.pdf', binIndex: 3 },
      { Key: '6.pdf', binIndex: 3 },
      { Key: '7.pdf', binIndex: 2 },
      { Key: '8.pdf', binIndex: 2 },
      { Key: '9.pdf', binIndex: 0 },
    ]);
  });

  it('throws if a file size exceeds maximum bin capacity', () => {
    const filesBinPacker = new FilesBinPacker([], (10 * 14) / 10);
    const files = [
      { Key: '1.pdf', Size: 8, Name: '1.pdf' },
      { Key: '2.pdf', Size: 11, Name: '2.pdf' },
      { Key: '3.pdf', Size: 4, Name: '3.pdf' },
      { Key: '4.pdf', Size: 3, Name: '4.pdf' },
      { Key: '5.pdf', Size: 1, Name: '5.pdf' },
      { Key: '6.pdf', Size: 1, Name: '6.pdf' },
      { Key: '7.pdf', Size: 5, Name: '7.pdf' },
      { Key: '8.pdf', Size: 5, Name: '8.pdf' },
      { Key: '9.pdf', Size: 2, Name: '9.pdf' },
    ];
    expect(() => filesBinPacker.addFiles(files)).to.throw('[Votre fichier "2.pdf" dépasse la taille maximale possible]');
  });
});
