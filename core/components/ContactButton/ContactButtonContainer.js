import employees from 'core/arrays/epotekEmployees';

import { compose, withProps, withState } from 'recompose';

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
  withState('open', 'toggleOpen', false),
);

export default ContactButtonContainer;
