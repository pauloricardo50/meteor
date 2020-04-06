import React from 'react';
import { Helmet } from 'react-helmet';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import { BasePromotionSchema } from 'core/api/promotions/schemas/PromotionSchema';
import collectionIcons from 'core/arrays/collectionIcons';
import { AutoFormDialog } from 'core/components/AutoForm2';
import Icon from 'core/components/Icon';

import AllPromotionsTable from './AllPromotionsTable';
import PromotionsPageContainer from './PromotionsPageContainer';

const PromotionsPage = ({ addPromotion }) => (
  <section className="card1 card-top promotions-page">
    <Helmet>
      <title>Promotions</title>
    </Helmet>
    <h1 className="flex center-align">
      <Icon
        type={collectionIcons[PROMOTIONS_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      Promotions
    </h1>
    <AutoFormDialog
      schema={BasePromotionSchema}
      buttonProps={{ label: 'Ajouter promotion', raised: true, primary: true }}
      onSubmit={addPromotion}
      title="Ajouter promotion"
      layout={[
        { className: 'mb-32 grid-col', fields: ['name', 'type'] },
        {
          layout: [
            { className: 'grid-col', fields: ['address1', 'address2'] },
            { className: 'grid-col', fields: ['zipCode', 'city'] },
            { className: 'grid-col', fields: ['agreementDuration'] },
          ],
        },
        'contacts',
      ]}
    />
    <AllPromotionsTable />
  </section>
);

export default PromotionsPageContainer(PromotionsPage);
