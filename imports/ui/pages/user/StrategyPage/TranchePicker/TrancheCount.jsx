import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';

const TrancheCount = ({ trancheCount, handleAdd, disabled }) => (
  <div className="tranche-count">
    <T id="TrancheCount.description" />
    <h4 style={{ paddingLeft: 8, paddingRight: 32 }}>{trancheCount}</h4>
    <Button
      raised
      primary
      onClick={handleAdd}
      label={<T id="TrancheCount.add" />}
      disabled={disabled}
    />
  </div>
);

TrancheCount.propTypes = {};

export default TrancheCount;
