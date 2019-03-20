import { compose, withProps } from 'recompose';
import query from 'core/api/users/queries/admins';
import { withSmartQuery } from 'core/api';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const oldAdmin = relatedDoc.assignedEmployee
    ? relatedDoc.assignedEmployee._id
    : undefined;
  const options = admins.map((admin) => {
    const { _id } = admin;

    return {
      id: _id,
      show: _id !== oldAdmin,
      label: admin.name,
      link: false,
      onClick: () =>
        onAdminSelectHandler({ newAdmin: admin, relatedDoc, oldAdmin }),
    };
  });
  return options;
};

export default compose(
  withSmartQuery({
    query,
    queryOptions: { reactive: true },
    dataName: 'admins',
    smallLoader: true,
  }),
  withProps(({ admins, doc, onAdminSelectHandler }) => {
    const options = getMenuItems({
      admins,
      relatedDoc: doc,
      onAdminSelectHandler,
    });

    return { options };
  }),
);
