const { print, types } = require('recast');
const { resolve: resolvePath } = require('path');

const { writeFileSync } = require('fs');
const { findTImport, findTComponents, getId } = require('./find-strings');
const walkApp = require('.');

const b = types.builders;

// eslint-disable-next-line import/no-dynamic-require
const lang = require(resolvePath(process.cwd(), 'imports/core/lang/fr.json'));

module.exports = function (importedFile) {
  const tName = findTImport(importedFile.path, importedFile.imports);
  let modified = false;
  const components = findTComponents(importedFile.ast, tName);

  components.forEach(component => {
    const id = getId(component);
    if (typeof id !== 'string') {
      return;
    }

    const content = lang[id];

    if (typeof content !== 'string') {
      return;
    }

    const index = component.attributes.findIndex(
      attr => attr.type === 'JSXAttribute' && attr.name.name === 'id',
    );
    component.attributes.splice(index, 1);
    let attrValue = null;
    // JSX doesn't allow escaping quotes, so we have to
    // put the string within an expression
    if (content.includes('/"')) {
      attrValue = b.jsxExpressionContainer(b.stringLiteral(content));
    } else {
      attrValue = b.literal(content);
    }

    const newAttr = b.jsxAttribute(
      b.jsxIdentifier('defaultMessage'),
      attrValue,
    );

    component.attributes.unshift(newAttr);
    modified = true;
  });

  if (modified) {
    // console.log('writing to', filePath);
    try {
      const result = print(importedFile.ast).code;
      writeFileSync(importedFile.path, result);
    } catch (e) {
      console.log('failed migrating', importedFile.path, e.message);
    }
  }
  console.log('modified', importedFile.path);
};

const archList = ['client'];
const startTime = new Date();
walkApp(process.cwd(), archList, importedFile => {
  module.exports(importedFile);
});

const endTime = new Date();

console.log('Spent:', `${endTime.getTime() - startTime.getTime()}ms`);
