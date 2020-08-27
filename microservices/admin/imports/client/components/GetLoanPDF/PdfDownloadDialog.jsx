import React, { useMemo } from 'react';
import SimpleSchema from 'simpl-schema';

import { AutoFormDialog } from 'core/components/AutoForm2';
import Box from 'core/components/Box';
import T from 'core/components/Translation';

import { BACKGROUND_INFO_TYPE, makeGenerateBackgroundInfo } from './helpers';

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
      allowedValues: loan.lenders?.map(
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
      allowedValues: loan?.adminAnalysis
        ? Object.values(BACKGROUND_INFO_TYPE)
        : Object.values(BACKGROUND_INFO_TYPE).filter(
            type => type !== BACKGROUND_INFO_TYPE.ADMIN_ANALYSIS,
          ),
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
    askForMaxLoan: {
      type: Boolean,
      optional: true,
      condition: ({ backgroundInfoType }) =>
        backgroundInfoType === BACKGROUND_INFO_TYPE.TEMPLATE,
    },
    includeMissingDocuments: {
      type: Boolean,
      optional: true,
      condition: ({ backgroundInfoType }) =>
        backgroundInfoType === BACKGROUND_INFO_TYPE.TEMPLATE,
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
        backgroundInfoType !== BACKGROUND_INFO_TYPE.CUSTOM,
      customAutoValue: makeGenerateBackgroundInfo(loan),
    },
  });

const PdfDownloadDialog = ({
  loan,
  onSubmit,
  buttonLabel,
  icon,
  dialogTitle,
}) => {
  const schema = useMemo(() => makeSchema(loan), [loan]);

  return (
    <AutoFormDialog
      title={dialogTitle}
      schema={schema}
      onSubmit={onSubmit}
      buttonProps={{
        raised: true,
        primary: true,
        label: buttonLabel,
        icon,
        style: { marginRight: 4 },
      }}
      model={{ structureIds: loan.structures.map(({ id }) => id) }}
      layout={[
        {
          Component: Box,
          title: <h5>Général</h5>,
          className: 'mb-32',
          fields: ['structureIds', 'organisationId'],
        },
        {
          Component: Box,
          title: <h5>Contexte</h5>,
          layout: [
            {
              className: 'mb-32',
              fields: ['backgroundInfoType', 'additionalInfo'],
            },
            {
              className: 'grid-2',
              fields: ['askForMaxLoan', 'includeMissingDocuments'],
            },
            'customBackgroundInfo',
            'backgroundInfoPreview',
          ],
        },
      ]}
    />
  );
};

export default PdfDownloadDialog;
