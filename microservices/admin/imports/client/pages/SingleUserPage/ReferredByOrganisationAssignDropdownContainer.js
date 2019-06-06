import { withProps, compose } from 'recompose';

import { setUserReferredByOrganisation } from 'core/api';
import { withSmartQuery } from 'core/api/containerToolkit';
import { adminOrganisations } from 'core/api/organisations/queries';

const getMenuItems = ({
  organisations,
  referredByOrganisation: { referredByOrganisationId } = {},
  userId,
}) =>
  organisations.map((organisation) => {
    const { _id: organisationId, name } = organisation;
    return {
      id: organisationId,
      show: organisationId !== referredByOrganisationId,
      label: name,
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
  withProps(({
    organisations = [],
    user: { _id: userId, referredByOrganisation },
  }) => ({
    options: getMenuItems({ organisations, referredByOrganisation, userId }),
    referredByOrganisation,
  })),
);
