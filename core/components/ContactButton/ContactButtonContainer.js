import employees from 'core/arrays/epotekEmployees';

import { compose, withProps, withState } from 'recompose';
import { withSmartQuery } from '../../api';
import appUserQuery from '../../api/users/queries/appUser';

const getStaffByEmail = email =>
  employees.find(employee => employee.email === email);

const ContactButtonContainer = compose(
  withSmartQuery({
    query: () => appUserQuery.clone(),
    dataName: 'currentUser',
    queryOptions: { single: true, reactive: true },
    renderMissingDoc: false,
  }),
  withProps(({ currentUser }) => {
    if (!currentUser || !currentUser.assignedEmployee) {
      return { staff: getStaffByEmail('yannis@e-potek.ch') };
    }
    return {
      staff: getStaffByEmail(currentUser.assignedEmployee.email),
    };
  }),
  withState('open', 'toggleOpen', false),
);

export default ContactButtonContainer;
