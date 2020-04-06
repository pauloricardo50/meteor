import React from 'react';
import moment from 'moment';
import SimpleSchema from 'simpl-schema';

import { decimalNegativeMoneyField } from 'core/api/helpers/sharedSchemas';
import { consolidateRevenue } from 'core/api/revenues/methodDefinitions';
import { AutoFormDialog } from 'core/components/AutoForm2';
import { CUSTOM_AUTOFIELD_TYPES } from 'core/components/AutoForm2/autoFormConstants';
import IconButton from 'core/components/IconButton';
import CollectionIconLink from 'core/components/IconLink/CollectionIconLink';
import { Money } from 'core/components/Translation';

const schema = new SimpleSchema({
  amount: {
    ...decimalNegativeMoneyField,
    optional: false,
    uniforms: { label: 'Montant exact' },
  },
  paidAt: {
    type: Date,
    uniforms: { type: CUSTOM_AUTOFIELD_TYPES.DATE },
  },
});

const RevenueConsolidator = ({
  revenue: { amount, _id: revenueId, sourceOrganisation, description, paidAt },
  onSubmitted = () => null,
}) => (
  <AutoFormDialog
    title="Confirmer paiement de"
    description={
      <div>
        <h2 className="flex center-align">
          <Money value={amount} className="mr-8" />
          <small className="secondary">
            {sourceOrganisation && (
              <>
                &nbsp;
                <CollectionIconLink relatedDoc={sourceOrganisation} />
              </>
            )}
          </small>
        </h2>
        {description && <p className="text-center">{description}</p>}
      </div>
    }
    schema={schema}
    model={{ amount, paidAt: paidAt && moment(paidAt).format('YYYY-MM-DD') }}
    onSubmit={values =>
      consolidateRevenue.run({ revenueId, ...values }).finally(onSubmitted)
    }
    triggerComponent={handleOpen => (
      <IconButton
        onClick={handleOpen}
        size="small"
        type="check"
        tooltip="Confirmer réception du paiememt"
        className="success"
      />
    )}
    layout={[{ className: 'grid-col', fields: ['amount', 'paidAt'] }]}
  />
);

export default RevenueConsolidator;
