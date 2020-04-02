import React, { useMemo } from 'react';
import omit from 'lodash/omit';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';

import { adminNotesSchema } from 'core/api/helpers/sharedSchemas';
import { INSURANCE_REQUESTS_COLLECTION } from 'core/api/insuranceRequests/insuranceRequestConstants';
import {
  insuranceRequestRemoveAdminNote,
  insuranceRequestSetAdminNote,
} from 'core/api/insuranceRequests/methodDefinitions';
import { INSURANCES_COLLECTION } from 'core/api/insurances/insuranceConstants';
import {
  insuranceRemoveAdminNote,
  insuranceSetAdminNote,
} from 'core/api/insurances/methodDefinitions';
import { AdminNoteSetter } from 'core/components/AdminNote/AdminNoteAdder';
import useInsuranceRequestContacts from 'core/components/AdminNote/useInsuranceRequestContacts';

const documentSelectSchema = (availableDocuments = []) =>
  new SimpleSchema({
    docId: {
      type: String,
      allowedValues: availableDocuments.map(({ _id }) => _id),
      uniforms: {
        transform: docId =>
          availableDocuments.find(({ _id }) => _id === docId).name,
        label: 'Relatif à',
        displayEmpty: false,
        allowNull: false,
        checkboxes: true,
      },
    },
  });

const adminNotesBaseSchema = new SimpleSchema(adminNotesSchema)
  .getObjectSchema('adminNotes.$')
  .omit('updatedBy', 'id');

const makeGetUpdateSchema = availableDocuments => () =>
  documentSelectSchema(availableDocuments).extend(adminNotesBaseSchema);

const makeGetInsertSchema = availableDocuments => contacts =>
  makeGetUpdateSchema(availableDocuments)().extend({
    notifyPros: {
      type: Array,
      condition: ({ isSharedWithPros }) =>
        isSharedWithPros && contacts.length > 0,
      uniforms: {
        label: `Notifier par email`,
        checkboxes: true,
      },
      optional: true,
    },
    'notifyPros.$': {
      type: String,
      allowedValues: contacts.map(({ email }) => email),
      uniforms: {
        transform: mail => {
          const user = contacts.find(({ email }) => email === mail);
          return (
            user && (
              <span>
                {user.name} <span className="secondary">{user.title}</span>
              </span>
            )
          );
        },
      },
    },
  });

const makeSetAdminNote = availableDocuments => ({
  run: ({ note, ...params }) => {
    const { docId, ...values } = note;
    const { collection } = availableDocuments.find(({ _id }) => _id === docId);

    let methodParams = { ...params, note: values };
    let method;

    switch (collection) {
      case INSURANCE_REQUESTS_COLLECTION:
        methodParams = {
          ...omit(methodParams, 'insuranceId'),
          insuranceRequestId: docId,
        };
        method = insuranceRequestSetAdminNote;
        break;
      case INSURANCES_COLLECTION:
        methodParams = {
          ...omit(methodParams, 'insuranceRequestId'),
          insuranceId: docId,
        };
        method = insuranceSetAdminNote;
        break;
      default:
        break;
    }

    return method.run(methodParams);
  },
});

export default withProps(
  ({
    doc: insuranceRequest,
    docId: insuranceRequestId,
    adminNote: { collection, docId } = {},
  }) => {
    const { insurances = [], name: insuranceRequestName } = insuranceRequest;
    const availableDocuments = [
      {
        _id: insuranceRequestId,
        collection: INSURANCE_REQUESTS_COLLECTION,
        name: `Dossier assurance ${insuranceRequestName}`,
      },
      ...insurances.map(({ _id, borrower, insuranceProduct: { name } }) => ({
        _id,
        name: `${name} - ${borrower.name}`,
        collection: INSURANCES_COLLECTION,
      })),
    ];
    let removeAdminNote;
    let methodParams;

    switch (collection) {
      case INSURANCE_REQUESTS_COLLECTION:
        removeAdminNote = insuranceRequestRemoveAdminNote;
        methodParams = { insuranceRequestId: docId };
        break;
      case INSURANCES_COLLECTION:
        removeAdminNote = insuranceRemoveAdminNote;
        methodParams = { insuranceId: docId };
        break;
      default:
        break;
    }

    const getInsertSchemaOverride = useMemo(
      () => makeGetInsertSchema(availableDocuments),
      [availableDocuments],
    );
    const getUpdateSchemaOverride = useMemo(
      () => makeGetUpdateSchema(availableDocuments),
      [availableDocuments],
    );

    return {
      getContacts: useInsuranceRequestContacts,
      setAdminNote: makeSetAdminNote(availableDocuments),
      removeAdminNote,
      methodParams,
      getInsertSchemaOverride,
      getUpdateSchemaOverride,
    };
  },
)(AdminNoteSetter);
