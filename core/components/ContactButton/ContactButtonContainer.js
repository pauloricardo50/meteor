import { withProps, compose } from 'recompose';

import { employeesByEmail, EPOTEK_NUMBER } from 'core/arrays/epotekEmployees';

const ContactButtonContainer = compose(
  withProps(({ currentUser }) => {
    let staff;
    if (currentUser && currentUser.assignedEmployee) {
      staff = employeesByEmail[currentUser.assignedEmployee.email];
    }
    if (!staff) {
      staff = {
        ...employeesByEmail['lydia@e-potek.ch'],
        phoneNumber: EPOTEK_NUMBER,
        email: 'financement@e-potek.ch',
      };
    }
    return { staff };
  }),
);

export default ContactButtonContainer;
