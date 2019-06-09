import { withProps, compose } from 'recompose';

import employees from 'core/arrays/epotekEmployees';
import { withContactButtonContext } from './ContactButtonContext';

const getStaffByEmail = email =>
  employees.find(employee => employee.email === email);

const ContactButtonContainer = compose(
  withProps(({ currentUser }) => {
    let staff;
    if (currentUser && currentUser.assignedEmployee) {
      staff = getStaffByEmail(currentUser.assignedEmployee.email);
    }
    if (!staff) {
      staff = getStaffByEmail('yannis@e-potek.ch');
    }
    return { staff };
  }),
  withContactButtonContext,
);

export default ContactButtonContainer;
