const changeCase = require('change-case');

module.exports = {
  description: 'application controller logic',
  prompts: [
    {
      type: 'input',
      name: 'collectionNameSingular',
      message: 'Enter collection name in camelCase (singular)',
    },
    {
      type: 'input',
      name: 'collectionNamePlural',
      message: 'Enter collection name in camelCase (plural)',
    },
  ],
  actions(data) {
    const actions = [];
    const collectionPath = `./core/api/${data.collectionNamePlural}`;
    const templatesPath = './plop/templates/collections';
    data.collection = changeCase.pascal(data.collectionNamePlural);
    data.collectionFile = data.collectionNamePlural;
    data.schema = `${changeCase.pascal(data.collectionNameSingular)}Schema`;
    data.schemaFile = `${data.collectionNameSingular}Schema`;
    data.serviceName = `${changeCase.pascal(
      data.collectionNameSingular,
    )}Service`;
    data.collectionConstant = `${changeCase.constantCase(
      data.collectionNamePlural,
    )}_COLLECTION`;
    data.constantsFile = `${data.collectionNameSingular}Constants`;
    data.collectionQueries = `${changeCase.constantCase(
      data.collectionNamePlural,
    )}_QUERIES`;
    data.methodInsert = `${data.collectionNameSingular}Insert`;
    data.methodRemove = `${data.collectionNameSingular}Remove`;
    data.methodUpdate = `${data.collectionNameSingular}Update`;
    data.query = `${data.collectionNamePlural}`;

    actions.push({
      type: 'add',
      path: `${collectionPath}/index.js`,
      templateFile: `${templatesPath}/index.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/{{collectionFile}}.js`,
      templateFile: `${templatesPath}/collection.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/{{constantsFile}}.js`,
      templateFile: `${templatesPath}/constants.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/server/{{serviceName}}.js`,
      templateFile: `${templatesPath}/service.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/methodDefinitions.js`,
      templateFile: `${templatesPath}/methodDefinitions.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/server/methods.js`,
      templateFile: `${templatesPath}/methods.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/schemas/{{schemaFile}}.js`,
      templateFile: `${templatesPath}/schema.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/links.js`,
      templateFile: `${templatesPath}/links.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/reducers.js`,
      templateFile: `${templatesPath}/reducers.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/queries/exposures.js`,
      templateFile: `${templatesPath}/exposures.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/queries/query.js`,
      templateFile: `${templatesPath}/query.hbs`,
    });
    actions.push({
      type: 'add',
      path: `${collectionPath}/queries/query.expose.js`,
      templateFile: `${templatesPath}/queryExpose.hbs`,
    });
    actions.push({
      type: 'append',
      path: './core/api/methods/server/registerServerMethods.js',
      pattern: /(^import \'\.\.\/\.\.\/.*;\n$)(?!\1)/m,
      templateFile: `${templatesPath}/registerServerMethodsAppend.hbs`,
      separator: '',
    });
    actions.push({
      type: 'format',
      path: collectionPath,
    });

    return actions;
  },
};
