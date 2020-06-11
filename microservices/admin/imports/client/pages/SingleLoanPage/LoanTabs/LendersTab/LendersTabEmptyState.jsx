import React from 'react';

import { ORGANISATIONS_COLLECTION } from 'core/api/organisations/organisationConstants';
import collectionIcons from 'core/arrays/collectionIcons';
import Icon from 'core/components/Icon';
import T from 'core/components/Translation';

const LendersTabEmptyState = props => (
  <div className="lenders-tab-empty-state">
    <Icon type={collectionIcons[ORGANISATIONS_COLLECTION]} />
    <h3 className="secondary">
      Changez le statut du dossier à "
      <T id="Forms.status.ONGOING" />" pour ajouter des prêteurs.
    </h3>
  </div>
);

export default LendersTabEmptyState;
