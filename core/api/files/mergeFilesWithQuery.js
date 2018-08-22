import merge from 'lodash/merge';
import { compose, mapProps, lifecycle } from 'recompose';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../events/ClientEventService';

const getFiles = (query, loanId, setFiles) => {
  query.clone({ loanId }).fetchOne((error, fileData) => {
    if (error) {
      throw error;
    }

    setFiles(fileData);
  });
};

const mergeFilesWithQuery = (query, mergeName) =>
  compose(
    lifecycle({
      componentDidMount() {
        let loanId;

        if (this.props.loan) {
          loanId = this.props.loan._id;

          const setFiles = fileData => this.setState({ fileData });

          // Get files for the first time on load
          getFiles(query, loanId, setFiles);

          // Get them again everytime this event is fired
          ClientEventService.addListener(MODIFIED_FILES_EVENT, () =>
            getFiles(query, loanId, setFiles));
        }
      },
      componentWillUnmount() {
        ClientEventService.removeAllListeners(MODIFIED_FILES_EVENT);
      },
    }),
    mapProps(({ fileData, ...props }) => ({
      ...props,
      // Very important to merge into an empty object, or else it overrides props!
      [mergeName]: merge({}, props[mergeName], fileData),
    })),
  );

export default mergeFilesWithQuery;

export const mapPropertyDocumentsIntoProperty = mapProps(({ loan, ...props }) => {
  const { structure, properties } = loan;
  const { property, propertyId } = structure;
  const structureProperty = properties.find(({ _id }) => _id === propertyId);
  const propertyDocuments = structureProperty && structureProperty.documents;

  return {
    ...props,
    loan: {
      ...loan,
      structure: {
        ...structure,
        property: {
          ...property,
          documents: propertyDocuments,
        },
      },
    },
  };
});

export const mergeFilesIntoLoanStructure = (...params) =>
  compose(
    mergeFilesWithQuery(...params),
    mapPropertyDocumentsIntoProperty,
  );
