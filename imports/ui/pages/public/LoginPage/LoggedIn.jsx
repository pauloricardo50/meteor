import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';

const LoggedIn = props => (
  <div className="flex-col center">
    <T id="LoginPage.loggedIn" />
    <Button color="primary">
      <T id="general.logout" />
    </Button>
  </div>
);

LoggedIn.propTypes = {};

export default LoggedIn;
