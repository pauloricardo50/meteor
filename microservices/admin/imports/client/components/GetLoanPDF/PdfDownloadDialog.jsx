// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';

type PdfDownloadDialogProps = {};

const makeSchema = loan =>
  new SimpleSchema({
    structureIds: {
      type: Array,
      uniforms: {
        label: 'Plans financiers',
        displayEmtpy: false,
        placeholder: '',
      },
    },
    'structureIds.$': {
      type: String,
      allowedValues: loan.structures.map(({ id }) => id),
      uniforms: {
        transform: structureId =>
          loan.structures.find(({ id }) => id === structureId).name,
      },
    },
    organisationId: {
      type: String,
      optional: true,
      allowedValues: loan.lenders.map(
        ({ organisation }) => organisation && organisation._id,
      ),
      uniforms: {
        transform: organisationId => {
          const lender = loan.lenders.find(
            ({ organisation }) => organisation._id === organisationId,
          );
          return lender.organisation.name;
        },
        label: <T id="Forms.organisationName" />,
        displayEmtpy: true,
        placeholder: "Pas d'organisation",
      },
    },
    context: {
      type: String,
      uniforms: {
        multiline: true,
        rows: 10,
      },
    },
  });

const PdfDownloadDialog = ({
  loan,
  onSubmit,
  buttonLabel,
  icon,
  dialogTitle,
}: PdfDownloadDialogProps) => (
  <AutoFormDialog
    title={dialogTitle}
    schema={makeSchema(loan)}
    onSubmit={onSubmit}
    buttonProps={{
      raised: true,
      primary: true,
      label: buttonLabel,
      icon,
      style: { marginRight: 4 },
    }}
    model={{ structureIds: loan.structures.map(({ id }) => id) }}
  />
);

export default PdfDownloadDialog;
