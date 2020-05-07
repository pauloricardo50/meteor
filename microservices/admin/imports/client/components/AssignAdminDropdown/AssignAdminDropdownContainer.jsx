import { compose, withProps } from 'recompose';

import { withSmartQuery } from 'core/api/containerToolkit';
import { ROLES, USERS_COLLECTION } from 'core/api/users/userConstants';

const getMenuItems = ({ admins, relatedDoc, onAdminSelectHandler }) => {
  const oldAdmin = relatedDoc.assignedEmployee
    ? relatedDoc.assignedEmployee._id
    : undefined;
  const options = [{ _id: null }, ...admins].map(admin => {
    const { _id } = admin;

    return {
      id: _id,
      show: _id !== oldAdmin,
      label: admin.firstName || 'Personne',
      link: false,
      onClick: () => onAdminSelectHandler({ newAdmin: admin, relatedDoc }),
    };
  });
  return options;
};

export default compose(
  withSmartQuery({
    query: USERS_COLLECTION,
    params: {
      $filters: { 'roles._id': ROLES.ADVISOR },
      firstName: 1,
      $options: { sort: { firstName: 1 } },
    },
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
