import Organisations from '../organisations';
import { ORGANISATION_QUERIES } from '../organisationConstants';
import { fullOrganisation } from '../../fragments';

const makeFilter = ({ param, field, filters }) => {
  if (param && !(Array.isArray(param) && !param.length)) {
    filters[field] = { $in: Array.isArray(param) ? param : [param] };
  }
};

export default Organisations.createQuery(
  ORGANISATION_QUERIES.ADMIN_ORGANISATIONS,
  {
    $filter({ filters, params: { features, tags, type } }) {
      makeFilter({ param: features, field: 'features', filters });
      makeFilter({ param: tags, field: 'tags', filters });
      makeFilter({ param: type, field: 'type', filters });
    },
    $options: { sort: { name: 1 } },
    ...fullOrganisation(),
  },
);
