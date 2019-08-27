import { withProps } from 'recompose';
import { organisationUpdate } from 'core/api/methods';
import { OrganisationSchema } from 'core/api/organisations/organisations';

export default withProps(({ organisation: { _id: organisationId } }) => ({
  updateOrganisation: object =>
    organisationUpdate.run({ organisationId, object }),
  schema: OrganisationSchema.omit(
    'contactIds',
    'logo',
    'userLinks',
    'canton',
    'documents',
    'lenderRulesCount',
    'adminNote',
  ),
}));
