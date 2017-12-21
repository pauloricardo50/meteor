import React from 'react';
import PropTypes from 'prop-types';

import Button from '/imports/ui/components/general/Button';
import { T } from 'core/components/Translation';
import { generalContainer } from 'core/containers/Containers';

const AddRequestPage = ({
  match: { params: { requestId } },
  currentUser: { address },
}) => (
  <div>
    <h3>
      Voulez vous ajouter cette nouvelle demande de prêt au compte
      {address[0].email}?
    </h3>
    <Button raised primary>
      <T id="general.yes" />
    </Button>
  </div>
);

AddRequestPage.propTypes = {};

export default generalContainer(AddRequestPage);
