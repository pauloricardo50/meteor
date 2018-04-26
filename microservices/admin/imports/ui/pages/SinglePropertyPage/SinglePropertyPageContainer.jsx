import query from 'core/api/properties/queries/property';
import { compose, withQuery, branch, renderComponent } from 'core/api';
import MissingDoc from '../../components/MissingDoc/MissingDoc';

export default compose(
  withQuery(
    ({ match, propertyId }) =>
      query.clone({ _id: propertyId || match.params.propertyId }),
    {
      reactive: true,
      single: true,
    },
  ),
  branch(
    ({ isLoading, data }) => !isLoading && !data,
    renderComponent(MissingDoc),
  ),
);
