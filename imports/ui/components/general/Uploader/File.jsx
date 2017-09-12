import React from 'react';
import PropTypes from 'prop-types';

import { T } from '/imports/ui/components/general/Translation';
import Button from '/imports/ui/components/general/Button';

const File = ({ name, size, type, url, fileCount, status, error }) => (
  <div className="file">
    <h5 className="secondary bold">{name}</h5>
    <div>
      <span className={`${status} bold`}>
        <T id={`Files.status.${status}`} />
      </span>
      {<Button label={<T id="general.delete" />} />}
    </div>
  </div>
);

File.propTypes = {};

export default File;
