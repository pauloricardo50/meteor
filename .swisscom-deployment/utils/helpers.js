import cmd from 'node-cmd';
import yaml from 'write-yaml';
import fs from 'fs';

export const executeCommand = command =>
  new Promise((resolve, reject) => {
    console.log(`${command}...`);
    cmd
      .get(command, (err, data, stderr) => {
        if (stderr || err) {
          reject(stderr || err);
        }
        resolve(data);
      })
      .stdout.on('data', console.log);
  });

export const mkdir = path => {
  return checkIfDirectoryOrFileExists(path).then(
    directoryExists =>
      directoryExists ? true : executeCommand(`mkdir ${path}`),
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
    .then(() => true)
    .catch(() => false);
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

export const writeBash = ({ file, data }) => {
  fs.writeFileSync(file, `#!/bin/bash\n${data}`);
  return executeCommand(`chmod +x ${file}`);
};

export const formatOptionsArray = array =>
  `[${array.map(el => `'${el}'`).join(', ')}]`;
