// @flow
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';

import { REVENUES_COLLECTION } from 'core/api/constants';
import Icon from 'core/components/Icon/Icon';
import collectionIcons from 'core/arrays/collectionIcons';
import Tabs from 'core/components/Tabs';
import { createRoute } from 'core/utils/routerUtils';
import RevenueAdder from '../../../components/RevenuesTable/RevenueAdder';
import RevenuesPageTable from './RevenuesPageTable';
import RevenuesPageCalendar from './RevenuesPageCalendar';
import RevenuesDistribution from './RevenuesDistribution';

type RevenuesPageTabProps = {};

const RevenuesPageTab = (props: RevenuesPageTabProps) => {
  const [open, setOpen] = useState(false);

  return (
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
        <RevenueAdder
          open={open}
          setOpen={setOpen}
          description="Ces revenus ne seront liés à aucun dossier. Si vous voulez les lier à un dossier hypothécaire, ajoutez-les depuis le dossier."
        />
      </div>

      <Tabs
        tabs={[
          {
            id: 'calendar',
            label: 'Calendrier',
            content: <RevenuesPageCalendar />,
          },
          { id: 'list', label: 'Liste', content: <RevenuesPageTable /> },
          {
            id: 'distribution',
            label: 'Répartition entre conseillers',
            content: <RevenuesDistribution />,
          },
        ].map(tab => ({
          ...tab,
          to: createRoute('/revenues/revenues/:revenuesTabId?', {
            revenuesTabId: tab.id,
          }),
        }))}
        routerParamName="revenuesTabId"
      />
    </div>
  );
};

export default RevenuesPageTab;
