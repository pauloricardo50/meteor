// @flow
import { Meteor } from 'meteor/meteor';

import React from 'react';
import { Helmet } from 'react-helmet';

import MapWithMarkerWrapper from '../../maps/MapWithMarkerWrapper';

import PromotionPageHeader from './PromotionPageHeader';
import ProPromotionLotsTable from './ProPromotionLotsTable';
import PromotionPageDocuments from './PromotionPageDocuments';
import AdditionalLotsTable from './AdditionalLotsTable';

import UserPromotionTables from './UserPromotionTables';
import PromotionPageButtons from './PromotionPageButtons';

type PromotionPageProps = {
  promotion: Object,
  currentUser: Object,
  loan: Object,
  canInviteCustomers: boolean,
  canManageDocuments: boolean,
  canSeeCustomers: boolean,
};

const PromotionPage = (props: PromotionPageProps) => {
  const { promotion, loan = {} } = props;

  const isApp = Meteor.microservice === 'app';

  return (
    <div className="card1 promotion-page">
      <Helmet>
        <title>{promotion.name}</title>
      </Helmet>
      <PromotionPageHeader {...props} />

      {Meteor.microservice !== 'app' && <PromotionPageButtons {...props} />}

      <MapWithMarkerWrapper
        address1={promotion.address1}
        city={promotion.city}
        zipCode={promotion.zipCode}
        options={{ zoom: 12 }}
        className="animated fadeIn delay-800"
      />

      <PromotionPageDocuments promotion={promotion} />
      {!isApp && (
        <>
          <ProPromotionLotsTable {...props} />
          <AdditionalLotsTable {...props} />
        </>
      )}
      {isApp && <UserPromotionTables loan={loan} promotion={promotion} />}
    </div>
  );
};

export default PromotionPage;
