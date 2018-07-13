import { compose, withProps } from 'recompose';
import { withSmartQuery } from '../../api';
import currentUserQuery from '../../api/users/queries/currentUser';
import employees from 'core/arrays/epotekEmployees';

const getStaffByEmail = email => employees.find(employee => employee.email === email);

const ContactButtonContainer = compose(
  withSmartQuery({
    query: () => currentUserQuery.clone(),
    dataName: 'currentUser',
    queryOptions: {
      single: true,
      reactive: true,
    },
    renderMissingDoc: false,
  }),
  withProps(({ currentUser }) => {
    if (!currentUser.assignedEmployee) {
      console.log(currentUser);
      return {
        staff: getStaffByEmail('yannis@e-potek.ch'),
      };
    }
    console.log(currentUser);
    return {
      staff: getStaffByEmail(currentUser.assignedEmployee.emails[0].address),
    };
  }),
);

export default ContactButtonContainer;
