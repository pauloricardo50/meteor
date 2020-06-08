const fs = require('fs');
const os = require('os');
const path = require('path');

const lockPath = path.resolve(os.tmpdir(), 'mup-prepare-bundle-lock.txt');

function removePrepareBundleLock() {
  try {
    fs.unlinkSync(lockPath);
  } catch (e) {
    if (e.code === 'ENOENT') {
      // lock doesn't exist. Can safely ignore
      return;
    }

    throw e;
  }
}

async function getPrepareBundleLock() {
  while (true) {
    if (!fs.existsSync(lockPath)) {
      fs.writeFileSync(lockPath, 'true');
      return;
    }

    // eslint-disable-next-line no-await-in-loop
    await new Promise(resolve => setTimeout(resolve, 10000));
  }
}

module.exports = {
  removePrepareBundleLock,
  getPrepareBundleLock,
};
