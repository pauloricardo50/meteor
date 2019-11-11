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

const getOtherDocuments = documents =>
  documents.filter(({ id, category: docCategory }) => {
    if (docCategory) {
      return docCategory === 'OTHER';
    }

    const docIsInList = Object.keys(DOCUMENTS_CATEGORIES).some(category =>
      DOCUMENTS_CATEGORIES[category].includes(id),
    );
    return !docIsInList;
  });

const makeOtherDocumentsObject = ({ documentsToDisplay, documentsToHide }) => ({
  documentsToDisplay: getOtherDocuments(documentsToDisplay),
  documentsToHide: getOtherDocuments(documentsToHide),
});

export default withProps(({ documentsToDisplay, documentsToHide }) => ({
  categories: {
    ...Object.keys(DOCUMENTS_CATEGORIES).reduce(
      (categories, category) => ({
        ...categories,
        [category]: makeDocumentsForCategoryObject({
          documentsToDisplay,
          documentsToHide,
          category,
        }),
      }),
      {},
    ),
    OTHER: makeOtherDocumentsObject({ documentsToDisplay, documentsToHide }),
  },
}));
