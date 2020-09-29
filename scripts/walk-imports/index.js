const fs = require('fs');
const path = require('path');
const readAndParse = require('./parse');

// TODO: the order is important
// extensions of files that are compiled into js
// and can import other js files.
const parseableExt = ['.js', '.jsx', '.svelte', '.ts', '.tsx'];

// These folders are not eagerly loaded by Meteor
// TODO: check if we should only exclude some of these when
// they are at the top level
const notEagerlyLoadedDirs = [
  'imports',
  'node_modules',
  'public',
  // TODO: have an option to include tests
  'tests',
  'test',
  'packages',
  'private',
];

// The path will start with one of these if
// it imports an app file
const appFileImport = ['.', path.posix.sep, path.win32.sep];

function shouldWalk(folderPath, archList) {
  const basename = path.basename(folderPath);
  if (basename[0] === '.' || notEagerlyLoadedDirs.includes(basename)) {
    return false;
  }

  const parts = folderPath.split(path.sep);
  if (!archList.includes('server') && parts.includes('server')) {
    return false;
  }
  if (!archList.includes('client') && parts.includes('client')) {
    return false;
  }

  return true;
}

function findExt(filePath) {
  const ext = parseableExt.find(possibleExt => {
    const exists = fs.existsSync(filePath + possibleExt);
    return exists;
  });

  if (ext) {
    return filePath + ext;
  }

  // Maybe it is the index file in a folder
  // TODO: check if this should be before or after checking extensions
  try {
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      return findExt(`${filePath}${path.sep}index`);
    }
  } catch (e) {
    // TODO: only ignore certain errors
  }
}

function shouldParse(filePath) {
  const ext = path.extname(filePath);
  const basename = path.basename(filePath);

  // TODO: have an option to parse test files
  if (
    basename.endsWith(`.app-tests${ext}`) ||
    basename.endsWith(`.spec${ext}`) ||
    basename.endsWith(`.test${ext}`)
  ) {
    return false;
  }

  return basename[0] !== '.' && parseableExt.includes(ext);
}

function isMeteorPackage(importPath) {
  return importPath.startsWith('meteor/');
}

function isNpmDependency(importPath) {
  return !appFileImport.includes(importPath[0]);
}

const handledFiles = new Set();

function getAbsFilePath(filePath) {
  // some files have no ext or are only the ext (.gitignore, .editorconfig, etc.)
  const existingExt =
    path.extname(filePath) || path.basename(filePath).startsWith('.');
  if (!existingExt) {
    // TODO: should maybe only do this if a file doesn't exists with the given path
    // since we might be importing a file with no extension.
    const pathWithExt = findExt(filePath);
    if (!pathWithExt) {
      console.log('unable to find ext', filePath);
      return pathWithExt;
    }

    return pathWithExt;
  }

  return filePath;
}

function handleFile(_filePath, appPath, onFile) {
  const filePath = getAbsFilePath(_filePath);

  if (!shouldParse(filePath) || handledFiles.has(filePath)) {
    return;
  }

  handledFiles.add(filePath);

  const ast = readAndParse(filePath);
  const imports = readAndParse.findImports(filePath, ast, appPath);
  onFile({ path: filePath, ast, imports });

  imports
    .filter(
      ({ source }) => !isMeteorPackage(source) && !isNpmDependency(source),
    )
    .map(({ source }) => {
      if (source[0] === '/') {
        source = appPath + source;
      }
      return path.resolve(path.dirname(filePath), source);
    })
    .forEach(importPath => {
      handleFile(importPath, appPath, onFile);
    });
}

function handleFolder(folderPath, appPath, archList, onFile) {
  const dirents = fs.readdirSync(folderPath, { withFileTypes: true });

  for (let i = 0; i < dirents.length; i += 1) {
    if (dirents[i].isDirectory()) {
      if (shouldWalk(path.resolve(folderPath, dirents[i].name), archList)) {
        handleFolder(
          path.resolve(folderPath, dirents[i].name),
          appPath,
          archList,
          onFile,
        );
      }
    } else if (dirents[i].isFile()) {
      const filePath = path.resolve(folderPath, dirents[i].name);
      handleFile(filePath, appPath, onFile);
    }
  }
}

module.exports = function walkApp(appPath, archList, onFile) {
  console.log('walking', appPath);
  handleFolder(appPath, appPath, archList, onFile);
};
