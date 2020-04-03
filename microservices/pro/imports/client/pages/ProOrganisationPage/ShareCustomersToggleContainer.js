import { compose, withProps, withState } from 'recompose';

import { proSetShareCustomers } from 'core/api/users/methodDefinitions';

export default compose(
  withState('openDialog', 'setOpenDialog', false),
  withState('loading', 'setLoading', false),
  withProps(
    ({
      organisation: {
        _id: organisationId,
        $metadata: { shareCustomers },
      },
      currentUser: { _id: userId },
      setOpenDialog,
      setLoading,
    }) => ({
      handleToggle: () => {
        if (!shareCustomers) {
          setOpenDialog(true);
        } else {
          proSetShareCustomers.run({
            userId,
            organisationId,
            shareCustomers: false,
          });
        }
      },
      handleSubmit: () => {
        setLoading(true);
        return proSetShareCustomers
          .run({ userId, organisationId, shareCustomers: true })
          .then(() => setOpenDialog(false))
          .finally(() => setLoading(false));
      },
    }),
  ),
);
