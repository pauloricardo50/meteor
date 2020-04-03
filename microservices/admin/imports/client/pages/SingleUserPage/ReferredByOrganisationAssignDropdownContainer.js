import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { adminOrganisations } from 'core/api/organisations/queries';
import { setUserReferredByOrganisation } from 'core/api/users/methodDefinitions';

const getMenuItems = ({
  organisations,
  referredByOrganisation: { referredByOrganisationId } = {},
  userId,
}) =>
  [null, ...organisations].map(organisation => {
    const { _id: organisationId, name } = organisation || {};
    let organisationName = 'Aucune';
    if (organisationId) {
      organisationName = name;
    }
    return {
      id: organisationId,
      show: organisationId !== referredByOrganisationId,
      label: organisationName,
      link: false,
      onClick: () =>
        setUserReferredByOrganisation.run({ userId, organisationId }),
    };
  });

export default compose(
  withSmartQuery({
    query: adminOrganisations,
    queryOptions: { reactive: false },
    params: { $body: { name: 1 } },
    dataName: 'organisations',
  }),
  withProps(
    ({
      organisations = [],
      user: { _id: userId, referredByOrganisation },
    }) => ({
      options: getMenuItems({
        organisations: organisations.sort((a, b) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        }),
        referredByOrganisation,
        userId,
      }),
      referredByOrganisation,
    }),
  ),
);
