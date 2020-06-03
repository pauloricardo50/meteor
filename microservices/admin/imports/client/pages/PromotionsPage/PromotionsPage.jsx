import React from 'react';
import { Helmet } from 'react-helmet';

import { PROMOTIONS_COLLECTION } from 'core/api/promotions/promotionConstants';
import {
  BasePromotionSchema,
  basePromotionLayout,
} from 'core/api/promotions/schemas/PromotionSchema';
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
      layout={basePromotionLayout}
    />
    <AllPromotionsTable />
  </section>
);

export default PromotionsPageContainer(PromotionsPage);
