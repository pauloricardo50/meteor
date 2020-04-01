import React, { useState, useMemo } from 'react';
import SimpleSchema from 'simpl-schema';
import moment from 'moment';

import AutoFormDialog from 'core/components/AutoForm2/AutoFormDialog';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/constants';
import { ORGANISATION_FEATURES, REVENUE_TYPES } from 'core/api/constants';

const getSchema = (sourceOrganisations = []) =>
  new SimpleSchema({
    date: {
      type: Date,
      uniforms: {
        label: 'Mois du décompte',
        type: CUSTOM_AUTOFIELD_TYPES.DATE,
        getProps: ({ value }) => ({
          type: 'month',
          value: value && moment(value).format('YYYY-MM'),
        }),
      },
    },
    organisationId: {
      type: String,
      allowedValues: sourceOrganisations
        .filter(({ features }) =>
          features.includes(ORGANISATION_FEATURES.INSURANCE),
        )
        .map(({ _id }) => _id),
      uniforms: {
        allowNull: false,
        displayEmpty: false,
        label: 'Source des revenus',
        transform: orgId =>
          sourceOrganisations.find(({ _id }) => _id === orgId).name,
      },
    },
  });

const InsuranceBillingFilter = props => {
  const {
    setRevenueDateRange,
    setSourceOrganisationId,
    sourceOrganisationId,
    sourceOrganisations,
    setType,
  } = props;
  const [label, setLabel] = useState('Réceptionner décompte assurance');
  const schema = useMemo(() => getSchema(sourceOrganisations), [
    sourceOrganisations,
  ]);

  return (
    <AutoFormDialog
      title="Réceptionner décompte assurance"
      description="Permet d'afficher tous les revenus assurance attendus dans le décompte d'un mois et d'une organisation sélectionnés. Un décompte annonçant en principe les revenus à recevoir un mois plus tard, les revenus attendus le mois suivant le décompte seront affichés. Par exemple, en sélectionnant le décompte Swisslife du mois d'avril 2020, seuls les revenus de type assurance attendus de la part de Swisslife au mois de mai 2020 seront affichés."
      schema={schema}
      onSubmit={({ date, organisationId }) =>
        new Promise((resolve, reject) => {
          setSourceOrganisationId({ $in: [organisationId] });
          setRevenueDateRange({
            startDate: moment(date)
              .add(1, 'month')
              .startOf('month')
              .toDate(),
            endDate: moment(date)
              .add(1, 'month')
              .endOf('month')
              .toDate(),
          });
          setType({ $in: [REVENUE_TYPES.INSURANCE] });
          setLabel(
            `Réceptionner décompte - ${
              sourceOrganisations.find(({ _id }) => _id === organisationId).name
            } ${moment(date).format('MMM YYYY')}`,
          );
          resolve();
        })
      }
      buttonProps={{
        primary: true,
        raised: true,
        label,
        style: { height: '40px' },
      }}
      model={{
        date: moment(new Date())
          .subtract(1, 'month')
          .format('YYYY-MM'),
        organisationId:
          sourceOrganisationId?.$in?.length === 1 &&
          sourceOrganisationId.$in[0],
      }}
    />
  );
};

export default InsuranceBillingFilter;
