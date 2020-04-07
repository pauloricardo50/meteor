import { compose, withProps } from 'recompose';

import { withSmartQuery } from '../../api/containerToolkit';
import { userImpersonatedSession } from '../../api/sessions/queries';
import { EPOTEK_NUMBER, employeesByEmail } from '../../arrays/epotekEmployees';

const withImpersonatedSession = withSmartQuery({
  query: userImpersonatedSession,
  queryOptions: { reactive: true, single: true },
  dataName: 'impersonatedSession',
  renderMissingDoc: false,
});

const ContactButtonContainer = compose(
  withImpersonatedSession,
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
