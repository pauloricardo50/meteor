/* eslint-env mocha */
import { expect } from 'chai';

import FilesChunksManager from '../FilesChunksManager';

describe('FilesChunksManager', () => {
  it('splits files in chunks', () => {
    const filesChunks = new FilesChunksManager(40000);
    const files = [
      { Key: 'doc1/documentA/1.pdf', Size: 10000 },
      { Key: 'doc1/documentB/2.pdf', Size: 10000 },
      { Key: 'doc1/documentC/3.pdf', Size: 10000 },
      { Key: 'doc2/documentA/1.pdf', Size: 10000 },
      { Key: 'doc2/documentA/2.pdf', Size: 10000 },
      { Key: 'doc2/documentA/3.pdf', Size: 40000 },
      { Key: 'doc3/documentB/1.pdf', Size: 10000 },
      { Key: 'doc3/documentC/1.pdf', Size: 10000 },
      { Key: 'doc4/documentA/1.pdf', Size: 10000 },
    ];
    filesChunks.appendFiles(files);
    filesChunks.splitFilesInChunks();
    const chunks = filesChunks.getChunks().map(chunk => ({
      files: chunk.getFiles().map(file => file.Key),
      size: chunk.getSize(),
    }));
    expect(chunks.length).to.equal(4);
    chunks.forEach(({ size }) => expect(size).to.be.at.most(40000));
    expect(chunks[0].files).to.deep.equal([
      'doc1/documentA/1.pdf',
      'doc1/documentB/2.pdf',
      'doc1/documentC/3.pdf',
      'doc4/documentA/1.pdf',
    ]);
    expect(chunks[1].files).to.deep.equal([
      'doc3/documentB/1.pdf',
      'doc3/documentC/1.pdf',
    ]);
    expect(chunks[2].files).to.deep.equal([
      'doc2/documentA/1.pdf',
      'doc2/documentA/2.pdf',
    ]);
    expect(chunks[3].files).to.deep.equal(['doc2/documentA/3.pdf']);
  });

  it('throws if a file exceeds maximum chunk size', () => {
    const filesChunks = new FilesChunksManager(40000);
    const files = [
      { Key: 'doc1/documentA/1.pdf', Size: 10000 },
      { Key: 'doc1/documentB/2.pdf', Size: 10000 },
      { Key: 'doc1/documentC/3.pdf', Size: 10000 },
      { Key: 'doc2/documentA/1.pdf', Size: 10000 },
      { Key: 'doc2/documentA/2.pdf', Size: 10000 },
      { Key: 'doc2/documentA/3.pdf', Size: 40001 },
      { Key: 'doc3/documentB/1.pdf', Size: 10000 },
      { Key: 'doc3/documentC/1.pdf', Size: 10000 },
      { Key: 'doc4/documentA/1.pdf', Size: 10000 },
    ];
    expect(() => filesChunks.appendFiles(files)).to.throw('Your file size exceeds maximum chunk size');
  });
});
