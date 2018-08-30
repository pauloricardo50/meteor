import cmd from 'node-cmd';
import yaml from 'write-yaml';
import fs from 'fs';

export const executeCommand = command =>
  new Promise((resolve, reject) => {
    cmd.get(command, (err, data, stderr) => {
      if (err || stderr) {
        reject(err || stderr);
      }
      resolve(data);
    });
  });

export const mkdir = path => {
  return checkIfDirectoryOrFileExists(path).then(
    directoryExists =>
      directoryExists ? Promise.resolve() : executeCommand(`mkdir ${path}`),
  );
};

export const rmDir = path => {
  return executeCommand(`rm -rf ${path}`);
};

export const rmFile = path => {
  return executeCommand(`rm ${path}`);
};

export const copyFile = ({ sourcePath, destinationPath }) => {
  return executeCommand(`cp ${sourcePath} ${destinationPath}`);
};

export const moveFile = ({ sourcePath, destinationPath }) => {
  return executeCommand(`mv ${sourcePath} ${destinationPath}`);
};

export const checkIfDirectoryOrFileExists = path => {
  return executeCommand(`ls ${path}`)
    .then(() => Promise.resolve(true))
    .catch(() => Promise.resolve(false));
};

export const writeYAML = ({ file, data }) => {
  return new Promise((resolve, reject) => {
    yaml(file, data, error => {
      error ? reject() : resolve();
    });
  });
};

export const writeJSON = ({ file, data }) => {
  fs.writeFileSync(file, JSON.stringify(data));
  return Promise.resolve();
};
