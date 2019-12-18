import fs from 'fs';
import path from 'path';

const meteorRoot = fs.realpathSync(`${process.cwd()}/../`);
let applicationRoot = fs.realpathSync(`${meteorRoot}/../`);

// if running on dev mode
if (path.basename(fs.realpathSync(`${meteorRoot}/../../../`)) === '.meteor') {
  applicationRoot = fs.realpathSync(`${meteorRoot}'/../../../../`);
}

const getPublicServerFile = (filePath, options) =>
  fs.readFileSync(`${applicationRoot}/public/${filePath}`, options);

export default getPublicServerFile;
