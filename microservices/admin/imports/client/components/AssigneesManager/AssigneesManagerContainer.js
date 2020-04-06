import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import { insuranceRequestSetAssignees } from 'core/api/insuranceRequests/methodDefinitions';
import { LOANS_COLLECTION } from 'core/api/loans/loanConstants';
import { loanSetAssignees } from 'core/api/loans/methodDefinitions';
import { adminUsers } from 'core/api/users/queries';
import { ROLES } from 'core/api/users/userConstants';

export const assigneesSchema = new SimpleSchema({
  assigneeLinks: { type: Array, optional: true, uniforms: { label: ' ' } },
  'assigneeLinks.$': Object,
  'assigneeLinks.$._id': {
    type: String,
    customAllowedValues: {
      query: adminUsers,
      params: () => ({
        roles: [ROLES.ADMIN],
        $body: { name: 1, $options: { sort: { name: 1 } } },
      }),
    },
    uniforms: {
      transform: user => (user ? user.name : ''),
      label: 'Conseiller',
      placeholder: null,
    },
  },
  'assigneeLinks.$.percent': {
    type: SimpleSchema.Integer,
    min: 10,
    max: 100,
    defaultValue: 100,
    uniforms: { label: 'Assist %' },
  },
  'assigneeLinks.$.isMain': {
    type: Boolean,
    defaultValue: false,
    uniforms: { label: 'Conseiller principal' },
  },
  note: {
    type: String,
    uniforms: { placeholder: 'Expliquer la raison de la nouvelle répartition' },
  },
  updateUserAssignee: {
    type: Boolean,
    defaultValue: false,
    optional: true,
    uniforms: { label: "Assigner le conseiller principal à l'utilisateur" },
  },
});

export default withProps(
  ({ doc: { _id: docId, assigneeLinks = [] }, collection }) => {
    let methodParams;
    let setAssignees;

    switch (collection) {
      case LOANS_COLLECTION:
        methodParams = { loanId: docId };
        setAssignees = loanSetAssignees;
        break;
      case INSURANCE_REQUESTS_COLLECTION:
        methodParams = { insuranceRequestId: docId };
        setAssignees = insuranceRequestSetAssignees;
        break;
      default:
        break;
    }

    return {
      schema: assigneesSchema,
      model: { assigneeLinks },
      onSubmit: ({ assigneeLinks: assignees, note, updateUserAssignee }) =>
        setAssignees.run({
          ...methodParams,
          assignees,
          note,
          updateUserAssignee,
        }),
    };
  },
);
