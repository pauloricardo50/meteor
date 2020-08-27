import { withProps } from 'recompose';

import { DOCUMENTS_CATEGORIES } from '../../api/files/fileConstants';

const getDocumentsForCategory = ({ documents, documentsCategory, category }) =>
  documents.filter(
    ({ id, category: docCategory }) =>
      documentsCategory.includes(id) || category === docCategory,
  );

const makeDocumentsForCategoryObject = ({
  documentsToDisplay,
  documentsToHide,
  category,
}) => ({
  documentsToDisplay: getDocumentsForCategory({
    documents: documentsToDisplay,
    documentsCategory: DOCUMENTS_CATEGORIES[category],
    category,
  }),
  documentsToHide: getDocumentsForCategory({
    documents: documentsToHide,
    documentsCategory: DOCUMENTS_CATEGORIES[category],
    category,
  }),
});

const getOtherDocuments = (documents, ignoreDocuments) =>
  documents.filter(({ id, category: docCategory }) => {
    if (ignoreDocuments.includes(id)) {
      return false;
    }
    if (docCategory) {
      return (
        docCategory === 'OTHER' ||
        !Object.keys(DOCUMENTS_CATEGORIES).includes(docCategory)
      );
    }

    const docIsInList = Object.keys(DOCUMENTS_CATEGORIES).some(category =>
      DOCUMENTS_CATEGORIES[category].includes(id),
    );
    return !docIsInList;
  });

const makeOtherDocumentsObject = ({
  documentsToDisplay,
  documentsToHide,
  ignoreDocuments,
}) => ({
  documentsToDisplay: getOtherDocuments(documentsToDisplay, ignoreDocuments),
  documentsToHide: getOtherDocuments(documentsToHide, ignoreDocuments),
});

export default withProps(
  ({
    documentsToDisplay,
    documentsToHide,
    categories,
    ignoreDocuments = [],
  }) => ({
    categories: categories || {
      ...Object.keys(DOCUMENTS_CATEGORIES).reduce(
        (cats, category) => ({
          ...cats,
          [category]: makeDocumentsForCategoryObject({
            documentsToDisplay,
            documentsToHide,
            category,
          }),
        }),
        {},
      ),
      OTHER: makeOtherDocumentsObject({
        documentsToDisplay,
        documentsToHide,
        ignoreDocuments,
      }),
    },
  }),
);
