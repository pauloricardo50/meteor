const {
  createTPaths,
  createDefineMessagePaths,
  findTImport,
  getAttrValue,
  createHash,
  findDmImport,
  findProperty,
} = require('./find-strings');

module.exports = function ({ types: t }) {
  const tPaths = createTPaths(process.cwd());
  const dmPaths = createDefineMessagePaths(process.cwd());
  const removeDefault = process.env.NODE_ENV === 'production';

  return {
    pre() {
      this.imports = [];
      this.tName = null;
      this.dmName = null;
    },
    visitor: {
      ImportDeclaration(path, state) {
        let importPath = path.node.source.value;
        this.imports.push({
          source: importPath,
          specifiers: path.node.specifiers,
        });
      },
      ExportNamedDeclaration(path) {
        if (!path.node.source) {
          return;
        }

        let importPath = path.node.source.value;
        this.imports.push({
          source: importPath,
        });
      },
      CallExpression(path, state) {
        if (path.node.callee.type === 'Import') {
          let importPath = path.node.arguments[0].value;
          this.imports.push({
            source: importPath,
          });
        } else {
          if (!this.dmName) {
            this.dmName = findDmImport(state.filename, this.imports, dmPaths);

            if (!this.dmName) {
              return;
            }
          }

          if (path.node.callee.name === this.dmName) {
            const config = path.node.arguments[0];
            const properties = path
              .get('arguments.0.properties')
              .map(a => a.node);
            let id = findProperty(properties, 'id');
            const defaultMessage = findProperty(properties, 'defaultMessage');
            const description = findProperty(properties, 'description');
            if (!id && (defaultMessage || description)) {
              id = createHash(defaultMessage, description);
              console.log('created id', id);
              path
                .get('arguments.0.properties')[0]
                .insertBefore(
                  t.objectProperty(t.stringLiteral('id'), t.stringLiteral(id)),
                );
            }
          }
        }
      },
      JSXOpeningElement(path, state) {
        const componentName = path.node.name.name;

        if (!this.tName) {
          this.tName = findTImport(state.filename, this.imports, tPaths);
        }

        if (!this.tName) {
          return;
        }

        if (componentName !== this.tName) {
          return;
        }

        const attrs = path.get('attributes');
        let id = getAttrValue(path.node, 'id');
        try {
          let defaultMessageAttr = attrs.find(
            attr =>
              attr.node.type === 'JSXAttribute' &&
              attr.node.name.name === 'defaultMessage',
          );
          let descriptionAttr = attrs.find(attr => {
            attr.node.type === 'JSXAttribute' &&
              attr.node.name.name === 'description';
          });
          let defaultMessage = getAttrValue(path.node, 'defaultMessage');
          let description = getAttrValue(path.node, 'description');
          if (!id && (defaultMessage || description)) {
            id = createHash(defaultMessage, description);
            (defaultMessageAttr || descriptionAttr).insertBefore(
              t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(id)),
            );
          }
          if (description) {
            // const index = attrs.findIndex(
            //   attr =>
            //     attr.type === 'JSXAttribute' &&
            //     attr.name.name === 'description',
            // );
            descriptionAttr.remove();
            // const attrPath = path.get(`attributes.${index}`);
            // attrPath.remove();
          }
          if (removeDefault) {
            defaultMessageAttr.remove();
          }
        } catch (e) {
          console.log(e);
          console.log(state.filename);
          process.exit(1);
          throw e;
        }
      },
    },
  };
};
