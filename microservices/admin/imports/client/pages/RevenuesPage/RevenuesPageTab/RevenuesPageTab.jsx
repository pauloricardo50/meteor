// @flow
import React from 'react';
import { Helmet } from 'react-helmet';

import { REVENUES_COLLECTION } from 'core/api/constants';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import RevenuesPageTable from './RevenuesPageTable';
import RevenueAdder from '../../../components/RevenuesTable/RevenueAdder';

type RevenuesPageTabProps = {};

const RevenuesPageTab = (props: RevenuesPageTabProps) => (
  <div>
    <Helmet>
      <title>Revenus</title>
    </Helmet>

    <div className="flex center-align">
      <Icon
        type={collectionIcons[REVENUES_COLLECTION]}
        style={{ marginRight: 8 }}
        size={32}
      />
      <h1 className="mr-8">Revenus</h1>
      <RevenueAdder description="Ces revenus ne seront liés à aucun dossier. Si vous voulez les lier à un dossier hypothécaire, ajoutez-les depuis le dossier." />
    </div>

    <RevenuesPageTable />
  </div>
);

export default RevenuesPageTab;
