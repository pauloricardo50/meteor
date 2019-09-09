import { Meteor } from 'meteor/meteor';

import FileService from 'core/api/files/server/FileService';

const CHUNK_SIZE = 10 * 1000 * 1000; // 10Mb

class Chunk {
  constructor(chunkSize = CHUNK_SIZE, index = 0) {
    this.chunkSize = chunkSize;
    this.size = 0;
    this.files = [];
    this.index = index;
  }

  getSize = () => this.size;

  getFiles = () => this.files;

  getIndex = () => this.index;

  canAppendFile = (file) => {
    const { Size } = file;
    return this.size + Size <= this.chunkSize;
  };

  canAppendFiles = (files = []) => {
    const size = files.reduce((total, { Size }) => total + Size, 0);
    return this.canAppendFile({ Size: size });
  };

  appendFile = (file) => {
    this.files = [...this.files, file];
    this.size += file.Size;
  };

  appendFiles = (files = []) => {
    files.map(this.appendFile);
  };
}

class FilesChunksManager {
  constructor(chunkSize = CHUNK_SIZE) {
    this.chunkSize = chunkSize;
    this.chunks = [new Chunk(chunkSize, 0)];
    this.files = [];
  }

  appendFile = (file) => {
    if (file.Size > this.chunkSize) {
      throw new Meteor.Error('Your file size exceeds maximum chunk size');
    }
    this.files = [...this.files, file];
  };

  appendFiles = (files = []) => {
    files.map(this.appendFile);
  };

  appendFilesToLastChunk = (files) => {
    this.getLastChunk().appendFiles(files);
    this.files = this.files.map((file) => {
      if (files.some(({ Key }) => Key === file.Key)) {
        return { ...file, chunkIndex: this.getLastChunk().getIndex() };
      }

      return file;
    });
  };

  getChunks = () => this.chunks;

  getLastChunk = () => this.chunks.slice(-1)[0];

  getFiles = () => this.files;

  addChunk = () => {
    const lastChunkIndex = this.getLastChunk().getIndex();
    this.chunks = [
      ...this.chunks,
      new Chunk(this.chunkSize, lastChunkIndex + 1),
    ];
  };

  getUnclassifiedFiles = () =>
    this.files.filter(({ chunkIndex }) => chunkIndex === undefined);

  sortFilesByDocIds = (files) => {
    const docIds = files
      .map(({ Key }) => FileService.getKeyParts(Key).docId)
      .filter((docId, index, self) => self.indexOf(docId) === index);

    return docIds.reduce(
      (docs, docId) => ({
        ...docs,
        [docId]: files.filter(({ Key }) => FileService.getKeyParts(Key).docId === docId),
      }),
      {},
    );
  };

  splitFilesInChunks = (filesToSplit = this.files) => {
    const sortedFiles = this.sortFilesByDocIds(filesToSplit);
    const docIds = Object.keys(sortedFiles);

    // Check if all files fit in last chunk
    if (this.getLastChunk().canAppendFiles(filesToSplit)) {
      this.appendFilesToLastChunk(filesToSplit);
      return;
    }

    const files = sortedFiles[docIds[0]];
    // Try to append all docId files to last chunk
    if (this.getLastChunk().canAppendFiles(files)) {
      this.appendFilesToLastChunk(files);
    } else {
      this.addChunk();
      // Append each docId file to last chunk one after the other
      files.forEach((file) => {
        if (this.getLastChunk().canAppendFile(file)) {
          this.appendFilesToLastChunk([file]);
        }
      });
    }

    const unclassifiedFiles = this.getUnclassifiedFiles();

    if (unclassifiedFiles.length === 0) {
      return;
    }

    return this.splitFilesInChunks(unclassifiedFiles);
  };
}

export default FilesChunksManager;
