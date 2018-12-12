const changeCase = require('change-case');

module.exports = function (plop) {
  plop.setGenerator('collection', {
    description: 'application controller logic',
    prompts: [
      {
        type: 'input',
        name: 'collectionName',
        message: 'Enter collection name in camelCase',
      },
    ],
    actions(data) {
      const actions = [];
      const collectionPath = './core/api/{{collectionName}}';
      const templatesPath = './plop-templates/collections';
      data.collection = changeCase.pascal(data.collectionName);
      data.schema = `${data.collection}Schema`;
      data.constants = `${data.collectionName}Constants`;
      data.serviceName = `${changeCase.pascal(data.collectionName)}Service`;
      data.collectionConstant = `${changeCase.constantCase(data.collectionName)}_COLLECTION`;
      data.collectionQueries = `${changeCase.constantCase(data.collectionName)}_QUERIES`;

      actions.push({
        type: 'add',
        path: `${collectionPath}/index.js`,
        templateFile: `${templatesPath}/index.hbs`,
      });
      actions.push({
        type: 'add',
        path: `${collectionPath}/{{collectionName}}.js`,
        templateFile: `${templatesPath}/collection.hbs`,
      });
      actions.push({
        type: 'add',
        path: `${collectionPath}/{{constants}}.js`,
        templateFile: `${templatesPath}/constants.hbs`,
      });
      actions.push({
        type: 'add',
        path: `${collectionPath}/{{serviceName}}.js`,
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
        path: `${collectionPath}/schemas/{{collectionName}}Schema.js`,
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
        path: `${collectionPath}/queries/{{collectionName}}Fragments/index.js`,
        templateFile: `${templatesPath}/fragmentsIndex.hbs`,
      });
      actions.push({
        type: 'add',
        path: `${collectionPath}/queries/{{collectionName}}Fragments/{{collectionName}}Fragments.js`,
        templateFile: `${templatesPath}/fragments.hbs`,
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
        path: './core/api/api-server.js',
        pattern: /(^import \b(?!SlackService)\S+ from .*;\n$)(?!\1)/m,
        templateFile: `${templatesPath}/apiServerImportAppend.hbs`,
        separator: '',
      });
      actions.push({
        type: 'append',
        path: './core/api/api-server.js',
        pattern: /(?<=export const Services = {\n)(.*)(?=};)/s,
        templateFile: `${templatesPath}/apiServerServicesAppend.hbs`,
        separator: '',
      });
      actions.push({
        type: 'append',
        path: './core/api/constants.js',
        pattern: /(^import { .* } from .*;\n$)(?!\1)/m,
        templateFile: `${templatesPath}/constantsImportAppend.hbs`,
        separator: '',
      });
      actions.push({
        type: 'append',
        path: './core/api/constants.js',
        pattern: /(^export \* from .*;\n$)(?!\1)/m,
        templateFile: `${templatesPath}/constantsExportAppend.hbs`,
        separator: '',
      });
      actions.push({
        type: 'append',
        path: './core/api/constants.js',
        pattern: /(?<=export const COLLECTIONS = {\n)(.*)(?=};)/s,
        templateFile: `${templatesPath}/constantsCollectionsAppend.hbs`,
        separator: '',
      });
      actions.push({
        type: 'append',
        path: './core/api/methods/server/registerServerMethods.js',
        pattern: /(^import \'\.\.\/\.\.\/.*;\n$)(?!\1)/m,
        templateFile: `${templatesPath}/registerServerMethodsAppend.hbs`,
        separator: '',
      });
      actions.push({
        type: 'append',
        path: './core/api/methods/registerMethodDefinitions.js',
        pattern: /(^export \* from .*;\n$)(?!\1)/s,
        templateFile: `${templatesPath}/registerMethodDefinitionsAppend.hbs`,
        separator: '',
      });

      return actions;
    },
  });
};
