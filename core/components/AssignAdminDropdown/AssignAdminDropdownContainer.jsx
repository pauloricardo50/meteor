import query from 'core/api/users/queries/admins';
import { compose, createContainer, withQuery } from 'core/api';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const currentAdmin = relatedDoc.assignedEmployeeId
    ? relatedDoc.assignedEmployeeId
    : undefined;
  const options = admins.map(admin => ({
    id: admin._id,
    show: admin._id !== currentAdmin,
    label: admin.emails[0].address,
    link: false,
    onClick: () =>
      onAdminSelectHandler({
        selectedAdmin: admin,
        relatedDoc,
        currentAdmin,
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
