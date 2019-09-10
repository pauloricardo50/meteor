const BIN_CAPACITY = 10 * 1000 * 1000; // 10Mb

class Bin {
  constructor(capacity = BIN_CAPACITY) {
    this.capacity = capacity;
    this.remainingCapacity = this.capacity;
    this.files = [];
  }

  canPackFile = (file) => {
    const { Size } = file;
    return this.remainingCapacity >= Size;
  };

  packFile = (file) => {
    const { Size } = file;
    this.files = [...this.files, file];
    this.remainingCapacity -= Size;
  };
}

class FilesBinPacker {
  constructor(files, binsCapacity = BIN_CAPACITY) {
    this.binsCapacity = binsCapacity;
    this.bins = [new Bin(binsCapacity)];
    this.files = [];
    if (files) {
      this.addFiles(files);
    }
  }

  addFile = (file) => {
    const { Size } = file;
    if (Size > this.binsCapacity) {
      throw new Meteor.Error('Your file size exceeds maximum bin capacity');
    }
    this.files = [...this.files, file];
  };

  addFiles = (files) => {
    files.forEach(this.addFile);
  };

  addBin = () => {
    const bin = new Bin(this.binsCapacity);
    this.bins = [...this.bins, bin];
    return bin;
  };

  // Best-fit bin packing algorithm
  packFiles = () => {
    this.files.forEach((file) => {
      const { bin: bestBin } = this.bins
        .map(bin =>
          (bin.canPackFile(file)
            ? { bin, remainingCapacity: bin.remainingCapacity - file.Size }
            : null))
        .filter(x => x)
        .reduce(
          (best, bin) =>
            (bin.remainingCapacity < best.remainingCapacity ? bin : best),
          { remainingCapacity: Infinity },
        );

      if (bestBin) {
        bestBin.packFile(file);
      } else {
        this.addBin().packFile(file);
      }
    });
  };

  getFileBinIndex = (file) => {
    const { Key } = file;
    let binIndex;
    this.bins.some(({ files = [] }, index) => {
      if (files.some(({ Key: fileKey }) => fileKey === Key)) {
        binIndex = index;
        return true;
      }
      return false;
    });
    return binIndex;
  };

  getFilesBinIndex = () =>
    this.files.map(file => ({
      Key: file.Key,
      binIndex: this.getFileBinIndex(file),
    }));
}

export default FilesBinPacker;
