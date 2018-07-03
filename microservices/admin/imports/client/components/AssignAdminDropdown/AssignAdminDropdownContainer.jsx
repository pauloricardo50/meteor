import query from 'core/api/users/queries/admins';
import { compose, createContainer, withQuery } from 'core/api';
import { getUserFullName } from 'core/utils/userFunctions';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const oldAdmin = relatedDoc.assignedEmployee
    ? relatedDoc.assignedEmployee._id
    : undefined;
  const options = admins.map((admin) => {
    const { _id, firstName, lastName, emails } = admin;

    return {
      id: _id,
      show: _id !== oldAdmin,
      label: getUserFullName({ firstName, lastName }) || emails[0].address,
      link: false,
      onClick: () =>
        onAdminSelectHandler({
          newAdmin: admin,
          relatedDoc,
          oldAdmin,
        }),
    };
  });
  return options;
};

export default compose(
  withQuery(() => query.clone(), { reactive: true }),
  createContainer(({ isLoading, data, doc, onAdminSelectHandler }) => {
    if (isLoading) {
      return { options: [] };
    }

    const options = getMenuItems({
      admins: data,
      relatedDoc: doc,
      onAdminSelectHandler,
    });

    return { options };
  }),
);
