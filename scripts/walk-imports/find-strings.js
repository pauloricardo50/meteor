const { resolve: resolvePath, dirname } = require('path');
const { visit } = require('ast-types');

function createTPaths(appDir) {
  return [
    resolvePath(appDir, 'imports/core/components/Translation/Translation.jsx'),
    resolvePath(appDir, 'imports/core/components/Translation/index.js'),
    resolvePath(appDir, 'imports/core/components/Translation'),
  ];
}

function expressionToString(expr) {
  if (expr.type === 'TemplateLiteral') {
    const parts = [...expr.expressions, ...expr.quasis].sort(
      (a, b) => a.start - b.start,
    );
    const regex = `${parts
      .map(part => {
        if (part.type === 'TemplateElement') {
          return part.value.raw.replace(/\./g, '\\.');
        }
        if (part.type === 'Identifier') {
          return '.[^.]*';
        }
        return '';
      })
      .join('')}$`;

    return new RegExp(regex);
  }
  const knownUnsupported = [
    'CallExpression',
    'Identifier',
    'ConditionalExpression',
  ];

  if (knownUnsupported.includes(expr.type)) {
    return null;
  }

  throw new Error('unsupported expression type');
}

// Node should be a JSXOpeningElement
// Returns the value of the id attribute
// Can be string, null, or a regexp if a template literal
// The regexp will match any id's that have the same number of periods
// and have any value for the part of the string that is an identifier
function getId(node) {
  if (!node.attributes) {
    return false;
  }

  const hasId = node.attributes
    .filter(attr => attr.type === 'JSXAttribute')
    .find(attr => attr.name.name === 'id');

  let value = null;
  if (hasId) {
    if (hasId.value.type === 'StringLiteral') {
      value = hasId.value.value;
    } else {
      value = expressionToString(hasId.value.expression);
    }
  }

  return value;
}

function getAttrValue(node, attrName) {
  if (!node.attributes) {
    return false;
  }

  const attr = node.attributes
    .filter(_attr => _attr.type === 'JSXAttribute')
    .find(_attr => _attr.name.name === attrName);

  let value = null;
  if (attr) {
    if (attr.value.type === 'StringLiteral') {
      value = attr.value.value;
    } else {
      value = expressionToString(attr.value.expression);
    }
  }

  return value;
}

// Returns the specifier used to import the T component
// Only supports import statements, not dynamic imports or
// require statements
function findTImport(filePath, imports, tPaths) {
  let result;
  imports.forEach(({ source, specifiers }) => {
    const importPath = resolvePath(dirname(filePath), source);
    if (tPaths.includes(importPath)) {
      if (result) {
        throw new Error('Two imports for tName?');
      }
      if (!specifiers) {
        throw new Error('t not imported with import declaration');
      }

      const tSpecifier = specifiers.find(
        specifier => specifier.type === 'ImportDefaultSpecifier',
      );
      if (!tSpecifier) {
        return false;
      }

      result = tSpecifier.local.name;
    }
  });

  return result;
}

function findTComponents(ast, tName) {
  const result = [];

  visit(ast, {
    visitJSXOpeningElement(path) {
      const componentName = path.node.name.name;
      if (componentName !== tName) {
        return false;
      }

      result.push(path.node);

      return false;
    },
  });

  return result;
}

module.exports = {
  createTPaths,
  getId,
  findTImport,
  findTComponents,
  getAttrValue,
};
