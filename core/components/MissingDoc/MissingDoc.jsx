import React from 'react';

import Link from '../Link';
import T from '../Translation';
import Button from '../Button';

const MisisngDoc = () => (
  <div className="flex-col center animated jackInTheBox">
    <div className="description">
      <p>
        <T id="MissingDoc.text" />
      </p>
    </div>
    <div className="flex center">
      <Link to="/" className="home-link">
        <Button raised color="secondary">
          <T id="MissingDoc.redirectHome" />
        </Button>
      </Link>
    </div>
  </div>
);

export default MisisngDoc;
