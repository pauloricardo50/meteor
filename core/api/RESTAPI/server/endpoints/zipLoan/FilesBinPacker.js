import { Meteor } from 'meteor/meteor';

import FileService from '../../../../files/server/FileService';

export const MIME_ENCODING_SIZE_FACTOR = 5 / 7;
const BIN_CAPACITY = 10 * 1000 * 1000; // 10Mb

class Bin {
  constructor(capacity = BIN_CAPACITY) {
    this.capacity = capacity;
    this.remainingCapacity = this.capacity;
    this.items = [];
  }

  canPackItem = (item) => {
    const size = this.getItemSize(item);
    return this.remainingCapacity >= size;
  };

  packItem = (item) => {
    const size = this.getItemSize(item);
    this.items = [...this.items, item];
    this.remainingCapacity -= size;
  };

  getItemSize = (item) => {
    const { Size } = item;
    return Size;
  };
}

class FilesBinPacker {
  constructor(files, binCapacity = BIN_CAPACITY) {
    this.binCapacity = binCapacity * MIME_ENCODING_SIZE_FACTOR;
    this.bins = [new Bin(this.binCapacity)];
    this.files = [];
    if (files) {
      this.addFiles(files);
    }
  }

  addFile = (file) => {
    const { Size, name } = file;
    if (Size > this.binCapacity) {
      throw new Meteor.Error(`Le fichier "${name}" dépasse la taille maximale possible`);
    }
    this.files = [...this.files, file];
  };

  addFiles = (files) => {
    files.forEach(this.addFile);
  };

  addBin = () => {
    const bin = new Bin(this.binCapacity);
    this.bins = [...this.bins, bin];
    return bin;
  };

  getAllDocumentIds = () =>
    this.files
      .map(({ Key }) => FileService.getKeyParts(Key).documentId)
      .filter((documentId, index, self) => self.indexOf(documentId) === index);

  getAllFilesForDocumentId = documentId =>
    this.files.filter(({ Key }) => FileService.getKeyParts(Key).documentId === documentId);

  getFilesTotalSize = files =>
    files.reduce((total, { Size }) => total + Size, 0);

  sortFiles = () => {
    const documentIds = this.getAllDocumentIds();
    return documentIds
      .map((documentId) => {
        const files = this.getAllFilesForDocumentId(documentId).sort((a, b) => {
          if (a.Size > b.Size) {
            return -1;
          }
          if (a.Size < b.Size) {
            return 1;
          }
          return 0;
        });
        return files;
      })
      .sort((a, b) => {
        const countA = a.length;
        const sizeA = this.getFilesTotalSize(a);
        const countB = b.length;
        const sizeB = this.getFilesTotalSize(b);

        if (sizeA * countA > sizeB * countB) {
          return -1;
        }

        if (sizeA * countA < sizeB * countB) {
          return 1;
        }

        return 0;
      })
      .reduce((allFiles, files) => [...allFiles, ...files], []);
  };

  getAllUnpackedFiles = documentId =>
    this.files
      .filter(({ Key }) =>
        !this.bins
          .reduce((files, { items = [] }) => [...files, ...items], [])
          .some(file => Key === file.Key))
      .filter(({ Key }) =>
        (documentId
          ? FileService.getKeyParts(Key).documentId === documentId
          : true));

  getFilesTotalSize = files =>
    files.reduce((total, { Size }) => total + Size, 0);

  // Best-fit bin packing algorithm
  packFiles = () => {
    this.sortFiles().forEach((file) => {
      const { bin: bestBin } = this.bins
        .map(bin =>
          bin.canPackItem(file) && {
            bin,
            remainingCapacity: bin.remainingCapacity - file.Size,
          })
        .filter(x => x)
        .reduce(
          (best, bin) =>
            (bin.remainingCapacity < best.remainingCapacity ? bin : best),
          { remainingCapacity: Infinity },
        );

      if (bestBin) {
        bestBin.packItem(file);
      } else {
        this.addBin().packItem(file);
      }
    });
  };

  getFileBinIndex = (file) => {
    const { Key } = file;
    return this.bins.findIndex(({ items = [] }) =>
      items.some(({ Key: fileKey }) => fileKey === Key));
  };

  getFilesBinIndex = () =>
    this.files.map(file => ({
      Key: file.Key,
      binIndex: this.getFileBinIndex(file),
    }));
}

export default FilesBinPacker;
