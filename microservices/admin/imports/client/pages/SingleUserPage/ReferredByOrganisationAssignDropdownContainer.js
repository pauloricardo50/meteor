import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import { setUserReferredByOrganisation } from 'core/api/users/methodDefinitions';

const getMenuItems = ({
  organisations,
  referredByOrganisation: { _id: referredByOrganisationId } = {},
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
    query: ORGANISATIONS_COLLECTION,
    params: { name: 1, $options: { sort: { name: 1 } } },
    dataName: 'organisations',
    refetchOnMethodCall: false,
    smallLoader: true,
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
