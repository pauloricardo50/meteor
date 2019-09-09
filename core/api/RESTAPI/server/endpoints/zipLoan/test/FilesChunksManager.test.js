/* eslint-env mocha */
import { expect } from 'chai';

import FilesChunksManager from '../FilesChunksManager';

describe('FilesChunksManager', () => {
  it('test name', () => {
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
    filesChunks.splitFilesToChunks();
    const chunks = filesChunks.getChunks();
    console.log(
      'chunks:',
      chunks.map(chunk => ({
        files: chunk.getFiles().map(file => file.Key),
        size: chunk.getSize(),
      })),
    );
    // Test code
  });
});
