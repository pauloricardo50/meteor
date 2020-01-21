import { compose, withProps, withStateHandlers } from 'recompose';
import { addUserToOrganisation } from 'core/api';

export default compose(
  withStateHandlers(
    () => ({
      userId: null,
      title: null,
    }),
    {
      setUserId: () => userId => ({ userId }),
      setTitle: () => title => ({ title }),
    },
  ),
  withProps(({ setUserId, setTitle, organisation }) => ({
    addUser: ({ userId, title }) =>
      addUserToOrganisation.run({
        organisationId: organisation._id,
        userId,
        metadata: { title },
      }),
    resetState: () => {
      setUserId(null);
      setTitle(null);
    },
  })),
);
