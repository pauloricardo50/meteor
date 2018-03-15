import query from 'core/api/users/queries/admins';
import { compose, createContainer, withQuery } from 'core/api';

export default compose(
  withQuery(
    props => {
      console.log('In here');
      return query.clone();
    },
    {
      reactive: true,
    },
  ),
  createContainer(props => {
    console.log('AssignAdminDropdownContainer');
    const {
      isLoading,
      data,
      relatedTask,
      styles,
      onAdminSelectHandler,
    } = props;
    console.log(props);
    const getMenuItems = ({ admins, relatedDoc }) => {
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

    const options = {
      options: isLoading
        ? []
        : getMenuItems({ admins: data || [], relatedDoc: relatedTask }),
    };
    return options;
  }),
);
