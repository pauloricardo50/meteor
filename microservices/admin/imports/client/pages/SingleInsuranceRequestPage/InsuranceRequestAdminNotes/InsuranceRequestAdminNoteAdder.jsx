import React from 'react';
import { withProps } from 'recompose';
import SimpleSchema from 'simpl-schema';
import omit from 'lodash/omit';

import { AdminNoteSetter } from 'core/components/AdminNote/AdminNoteAdder';
import useInsuranceRequestContacts from 'core/components/AdminNote/useInsuranceRequestContacts';
import {
  INSURANCES_COLLECTION,
  INSURANCE_REQUESTS_COLLECTION,
} from 'core/api/constants';
import {
  insuranceRequestSetAdminNote,
  insuranceSetAdminNote,
  insuranceRequestRemoveAdminNote,
  insuranceRemoveAdminNote,
} from 'core/api/methods';

import { adminNotesSchema } from 'core/api/helpers/sharedSchemas';

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
      },
    },
  });

const makeGetUpdateSchema = availableDocuments => () =>
  documentSelectSchema(availableDocuments).extend(
    new SimpleSchema(adminNotesSchema)
      .getObjectSchema('adminNotes.$')
      .omit('updatedBy', 'id'),
  );

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
        name: insuranceRequestName,
      },
      ...insurances.map(({ _id, name }) => ({
        _id,
        name,
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

    return {
      getContacts: useInsuranceRequestContacts,
      setAdminNote: makeSetAdminNote(availableDocuments),
      removeAdminNote,
      methodParams,
      getInsertSchemaOverride: makeGetInsertSchema(availableDocuments),
      getUpdateSchemaOverride: makeGetUpdateSchema(availableDocuments),
    };
  },
)(AdminNoteSetter);
