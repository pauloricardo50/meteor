/* eslint-env mocha */
import { expect } from 'chai';

import { additionalDocumentsAutovalue } from '../sharedSchemas';

describe.only('additionalDocumentsAutovalue', () => {
  let autovalueContext;

  const INITIAL_DOCUMENTS = {
    INITIAL_DOCUMENT_1: 'INITIAL_DOCUMENT_1',
    INITIAL_DOCUMENT_2: 'INITIAL_DOCUMENT_2',
  };

  const initialDocuments = [
    { id: INITIAL_DOCUMENTS.INITIAL_DOCUMENT_1 },
    { id: INITIAL_DOCUMENTS.INITIAL_DOCUMENT_2 },
  ];

  const DOC_KEYS = {
    KEY1: {
      name: 'KEY1',
      values: ['KEY1_VALUE1', 'KEY1_VALUE2'],
    },
    KEY2: {
      name: 'KEY2',
      values: ['KEY2_VALUE1', 'KEY2_VALUE2'],
    },
  };

  const CONDITIONAL_DOCUMENTS = {
    CONDITIONAL_DOC_1: 'CONDITIONAL_DOC_1',
    CONDITIONAL_DOC_2: 'CONDITIONAL_DOC_2',
    CONDITIONAL_DOC_3: 'CONDITIONAL_DOC_3',
    CONDITIONAL_DOC_4: 'CONDITIONAL_DOC_4',
  };

  const conditionalDocuments = [
    {
      id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_1,
      condition: ({ doc, context }) =>
        doc[DOC_KEYS.KEY1.name] !== DOC_KEYS.KEY1.values[0]
        && context.field(DOC_KEYS.KEY1.name).value === DOC_KEYS.KEY1.values[0],
    },
    {
      id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_2,
      condition: ({ doc, context }) =>
        doc[DOC_KEYS.KEY1.name] !== DOC_KEYS.KEY1.values[1]
        && context.field(DOC_KEYS.KEY1.name).value === DOC_KEYS.KEY1.values[1],
    },
    {
      id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_3,
      condition: ({ doc, context }) =>
        // doc[DOC_KEYS.KEY2.name] !== DOC_KEYS.KEY2.values[0]
        // &&
        context.field(DOC_KEYS.KEY2.name).value === DOC_KEYS.KEY2.values[0],
    },
    {
      id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_4,
      condition: ({ doc, context }) =>
        // doc[DOC_KEYS.KEY2.name] !== DOC_KEYS.KEY2.values[1]
        // &&
        context.field(DOC_KEYS.KEY2.name).value === DOC_KEYS.KEY2.values[1],
    },
  ];

  beforeEach(() => {
    autovalueContext = {
      isInsert: false,
      fields: {},
      field(fieldName) {
        return { value: this.fields[fieldName] };
      },
    };
  });

  it('should add initial documents if doc is inserted', () => {
    autovalueContext.isInsert = true;
    const doc = {
      additionalDocuments: [],
    };

    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.equal(initialDocuments);
  });

  it('should not remove initial documents if doc is updated', () => {
    autovalueContext.isInsert = false;
    const doc = {
      additionalDocuments: initialDocuments,
    };

    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.equal(initialDocuments);
  });

  it('should add additional documents if condition is met', () => {
    autovalueContext.isInsert = true;
    autovalueContext.fields = {
      [DOC_KEYS.KEY1.name]: DOC_KEYS.KEY1.values[0],
      [DOC_KEYS.KEY2.name]: DOC_KEYS.KEY2.values[0],
    };

    const doc = {
      additionalDocuments: [],
    };

    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.equal([
      ...initialDocuments,
      { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_1 },
      { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_3 },
    ]);
  });

  it('should remove old additional documents and add new ones if condition result has changed', () => {
    autovalueContext.isInsert = false;
    autovalueContext.fields = {
      [DOC_KEYS.KEY1.name]: DOC_KEYS.KEY1.values[1],
      [DOC_KEYS.KEY2.name]: DOC_KEYS.KEY2.values[1],
    };

    const doc = {
      additionalDocuments: [
        { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_1 },
        { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_3 },
      ],
      [DOC_KEYS.KEY1.name]: DOC_KEYS.KEY1.values[0],
      [DOC_KEYS.KEY2.name]: DOC_KEYS.KEY2.values[0],
    };

    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.equal([
      { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_2 },
      { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_4 },
    ]);
  });

  it('should keep additional documents if condition result has not changed', () => {
    autovalueContext.isInsert = false;
    autovalueContext.fields = {
      [DOC_KEYS.KEY1.name]: DOC_KEYS.KEY1.values[1],
      [DOC_KEYS.KEY2.name]: DOC_KEYS.KEY2.values[1],
    };

    const doc = {
      additionalDocuments: [
        { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_2 },
        { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_4 },
      ],
      [DOC_KEYS.KEY1.name]: DOC_KEYS.KEY1.values[1],
      [DOC_KEYS.KEY2.name]: DOC_KEYS.KEY2.values[1],
    };

    console.log(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    }));
    expect(additionalDocumentsAutovalue({
      doc,
      conditionalDocuments,
      initialDocuments,
      context: autovalueContext,
    })).to.deep.equal([
      { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_2 },
      { id: CONDITIONAL_DOCUMENTS.CONDITIONAL_DOC_4 },
    ]);
  });
});
