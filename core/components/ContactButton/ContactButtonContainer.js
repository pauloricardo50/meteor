import { compose, withProps } from 'recompose';

import withSmartQuery from 'core/api/containerToolkit/withSmartQuery';
import { userImpersonatedSession } from 'core/api/sessions/queries';
import { EPOTEK_NUMBER, employeesByEmail } from 'core/arrays/epotekEmployees';

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
      staff = employeesByEmail['financement@e-potek.ch'];
    }
    return { staff };
  }),
);

export default ContactButtonContainer;
