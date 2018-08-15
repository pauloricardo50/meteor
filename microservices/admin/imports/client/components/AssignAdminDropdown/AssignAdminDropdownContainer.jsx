import { compose, withProps } from 'recompose';
import query from 'core/api/users/queries/admins';
import { withSmartQuery } from 'core/api';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const oldAdmin = relatedDoc.assignedEmployee
    ? relatedDoc.assignedEmployee._id
    : undefined;
  const options = admins.map((admin) => {
    const { _id, firstName, lastName, emails, username } = admin;

    return {
      id: _id,
      show: _id !== oldAdmin,
      label: admin.name,
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
  withSmartQuery({
    query: () => query.clone(),
    queryoptions: { reactive: true },
  }),
  withProps(({ data, doc, onAdminSelectHandler }) => {
    const options = getMenuItems({
      admins: data,
      relatedDoc: doc,
      onAdminSelectHandler,
    });

    return { options };
  }),
);
