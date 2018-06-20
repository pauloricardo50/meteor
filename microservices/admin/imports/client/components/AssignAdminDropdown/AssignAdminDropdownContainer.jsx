import query from 'core/api/users/queries/admins';
import { compose, createContainer, withQuery } from 'core/api';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const oldAdmin = relatedDoc.assignedEmployee
    ? relatedDoc.assignedEmployee._id
    : undefined;
  const options = admins.map(admin => ({
    id: admin._id,
    show: admin._id !== oldAdmin,
    label: admin.emails[0].address,
    link: false,
    onClick: () =>
      onAdminSelectHandler({
        newAdmin: admin,
        relatedDoc,
        oldAdmin,
      }),
  }));
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
