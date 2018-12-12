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
      data.collection = changeCase.pascal(data.collectionName);
      data.schema = `${data.collection}Schema`;
      data.collectionConstant = `${changeCase.constantCase(data.collectionName)}_COLLECTION`;
      data.collectionQueries = `${changeCase.constantCase(data.collectionName)}_QUERIES`;
      actions.push({
        type: 'add',
        path: './core/api/{{collectionName}}/{{collectionName}}.js',
        templateFile: './plop-templates/collections/collection.hbs',
      });
      return actions;
    },
  });
};
