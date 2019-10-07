import { compose, withProps } from 'recompose';
import { adminUsers as query } from 'core/api/users/queries';
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
        onAdminSelectHandler({ newAdmin: admin, relatedDoc }),
    };
  });
  return options;
};

export default compose(
  withSmartQuery({
    query,
    params: { admins: true, $body: { name: 1 } },
    queryOptions: { reactive: false },
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
