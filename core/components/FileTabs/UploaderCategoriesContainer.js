import { withProps } from 'recompose';
import { DOCUMENTS_CATEGORIES } from '../../api/files/fileConstants';

const getDocumentsForCategory = ({ documents, categoryDocuments }) =>
  documents.filter(({ id }) => categoryDocuments.includes(id));
const makeDocumentsForCategoryObject = ({
  documentsToDisplay,
  documentsToHide,
  category,
}) => ({
  documentsToDisplay: getDocumentsForCategory({
    documents: documentsToDisplay,
    categoryDocuments: DOCUMENTS_CATEGORIES[category],
  }),
  documentsToHide: getDocumentsForCategory({
    documents: documentsToHide,
    categoryDocuments: DOCUMENTS_CATEGORIES[category],
  }),
});

const getOtherDocuments = documents =>
  documents.filter(({ id }) =>
    !Object.keys(DOCUMENTS_CATEGORIES).some(category =>
      DOCUMENTS_CATEGORIES[category].includes(id)));

const makeOtherDocumentsObject = ({ documentsToDisplay, documentsToHide }) => ({
  documentsToDisplay: getOtherDocuments(documentsToDisplay),
  documentsToHide: getOtherDocuments(documentsToHide),
});

export default withProps(({ documentsToDisplay, documentsToHide }) => ({
  categories: {
    ...Object.keys(DOCUMENTS_CATEGORIES).reduce(
      (categories, category) => ({
        ...categories,
        [category]: {
          ...makeDocumentsForCategoryObject({
            documentsToDisplay,
            documentsToHide,
            category,
          }),
        },
      }),
      {},
    ),
    OTHER: {
      ...makeOtherDocumentsObject({ documentsToDisplay, documentsToHide }),
    },
  },
}));
