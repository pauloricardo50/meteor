import { withProps, compose } from 'recompose';

import { employeesByEmail, EPOTEK_NUMBER } from 'core/arrays/epotekEmployees';
import { userImpersonatedSession } from 'core/api/sessions/queries';
import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';

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
