import { compose, mapProps } from 'recompose';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import proLoans from 'core/api/loans/queries/proLoans';

export default compose(
  mapProps(({ currentUser, ...props }) => {
    const {
      properties = [],
      promotions = [],
      proProperties = [],
    } = currentUser;
    return {
      currentUser,
      properyIds: [
        ...properties.map(({ _id }) => _id),
        ...proProperties.map(({ _id }) => _id),
      ],
      promotionIds: promotions.map(({ _id }) => _id),
      ...props,
    };
  }),
  withSmartQuery({
    query: proLoans,
    params: ({ propertyIds, promotionIds }) => ({
      promotionId: { $in: promotionIds },
      propertyId: { $in: propertyIds },
    }),
    queryOptions: { reactive: false },
    dataName: 'loans',
  }),
);
