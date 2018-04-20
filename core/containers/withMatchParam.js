import { withRouter } from 'react-router-dom';
import { compose, createContainer } from '../api/containerToolkit';

export default paramName =>
  compose(
    withRouter,
    createContainer(({ match }) => ({ [paramName]: match.params[paramName] })),
  );
