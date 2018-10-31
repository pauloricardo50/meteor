import merge from 'lodash/merge';
import { compose, mapProps, withProps, lifecycle, withState } from 'recompose';
import ClientEventService, {
  MODIFIED_FILES_EVENT,
} from '../events/ClientEventService';

const getFiles = (query, queryParams, setFiles) => {
  console.log('getFiles');
  query.clone(queryParams).fetchOne((error, fileData) => {
    console.log('getfiles error', error);
    console.log('fileData', fileData);
    if (error) {
      throw error;
    }

    setFiles(fileData);
  });
};

const mergeFilesWithQuery = (query, queryParamsFunc, mergeName) =>
  compose(
    withProps(props => ({ queryParams: queryParamsFunc(props) })),
    withState('documentsLoaded', 'setDocumentsLoaded', false),
    lifecycle({
      componentDidMount() {
        const { queryParams } = this.props;
        const queryParamsAreDefined = queryParams && Object.values(queryParams).some(x => x);

        if (queryParamsAreDefined) {
          const setFiles = (fileData) => {
            this.props.setDocumentsLoaded(true);
            this.setState({ fileData });
          };

          // Get files for the first time on load
          getFiles(query, queryParams, setFiles);

          // Get them again everytime this event is fired
          ClientEventService.addListener(MODIFIED_FILES_EVENT, () =>
            getFiles(query, queryParams, setFiles));
        }
      },
      componentWillUnmount() {
        ClientEventService.removeAllListeners(MODIFIED_FILES_EVENT);
      },
    }),
    mapProps(({ fileData, documentsLoaded, ...props }) => ({
      ...props,
      // Very important to merge into an empty object, or else it overrides props!
      [mergeName]: merge({}, { documentsLoaded }, props[mergeName], fileData),
    })),
  );

export default mergeFilesWithQuery;

export const mapPropertyDocumentsIntoProperty = mapProps(({ loan, ...props }) => {
  if (!loan || !loan.structure) {
    return props;
  }
  const { structure, properties = [] } = loan;
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
