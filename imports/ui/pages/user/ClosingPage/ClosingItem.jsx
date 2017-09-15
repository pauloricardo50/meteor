import React from 'react';
import PropTypes from 'prop-types';

import { Uploader } from '/imports/ui/components/general/UploaderArray';

const ClosingItem = ({ item }) => {
  const { type, title, id } = item;
  if (type === 'upload') {
    return <Uploader />;
  }
  return (
    <div className="mask1">
      <div className="title">{title}</div>
    </div>
  );
};

ClosingItem.propTypes = {};

export default ClosingItem;
