import { withProps } from 'recompose';
import { organisationUpdate } from 'imports/core/api/methods/index';
import { OrganisationSchema } from 'core/api/organisations/organisations';

export default withProps(({ organisation: { _id: organisationId } }) => ({
  updateOrganisation: object =>
    organisationUpdate.run({ organisationId, object }),
  schema: OrganisationSchema.omit('contactIds', 'logo'),
}));
