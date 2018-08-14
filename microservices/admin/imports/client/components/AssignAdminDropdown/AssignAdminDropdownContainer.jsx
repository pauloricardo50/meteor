import query from 'core/api/users/queries/admins';
import { compose, createContainer, withSmartQuery } from 'core/api';
import { getUserDisplayName } from 'core/utils/userFunctions';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const oldAdmin = relatedDoc.assignedEmployee
    ? relatedDoc.assignedEmployee._id
    : undefined;
  const options = admins.map((admin) => {
    const { _id, firstName, lastName, emails, username } = admin;

    return {
      id: _id,
      show: _id !== oldAdmin,
      label: getUserDisplayName({ firstName, lastName, username, emails }),
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
    dataName: 'admins',
  }),
  createContainer(({ admins, doc, onAdminSelectHandler }) => {
    const options = getMenuItems({
      admins,
      relatedDoc: doc,
      onAdminSelectHandler,
    });

    return { options };
  }),
);
