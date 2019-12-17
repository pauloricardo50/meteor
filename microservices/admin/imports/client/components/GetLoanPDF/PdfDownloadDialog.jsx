// @flow
import React from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import T from 'core/components/Translation';
import { makeGenerateBackgroundInfo, BACKGROUND_INFO_TYPE } from './helpers';

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
    backgroundInfoType: {
      type: String,
      allowedValues: Object.values(BACKGROUND_INFO_TYPE),
      defaultValue: BACKGROUND_INFO_TYPE.TEMPLATE,
      uniforms: {
        displayEmpty: false,
        placeholder: '',
      },
    },
    customBackgroundInfo: {
      type: String,
      optional: true,
      condition: ({ backgroundInfoType }) =>
        backgroundInfoType === BACKGROUND_INFO_TYPE.CUSTOM,
      uniforms: {
        multiline: true,
        rows: 10,
        label: <T id="Forms.backgroundInfo" />,
        placeholder:
          'Bonjour,\nNous avons le plaisir de vous remettre une nouvelle demande de financement pour les clients précités',
      },
    },
    additionalInfo: {
      type: Array,
      optional: true,
      condition: ({ backgroundInfoType }) =>
        backgroundInfoType === BACKGROUND_INFO_TYPE.TEMPLATE,
    },
    'additionalInfo.$': {
      type: String,
    },
    backgroundInfoPreview: {
      type: String,
      optional: true,
      uniforms: {
        multiline: true,
        rows: 10,
        disabled: true,
        label: <T id="Forms.backgroundInfo" />,
      },
      condition: ({ backgroundInfoType }) =>
        backgroundInfoType === BACKGROUND_INFO_TYPE.TEMPLATE,
      customAutoValue: makeGenerateBackgroundInfo(loan),
    },
  });

const PdfDownloadDialog = ({
  loan,
  onSubmit,
  buttonLabel,
  icon,
  dialogTitle,
  generateBackgroundInfo,
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
