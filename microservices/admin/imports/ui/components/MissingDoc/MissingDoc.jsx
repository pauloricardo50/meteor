import React from 'react';
import { Link } from 'react-router-dom';

import { T } from 'core/components/Translation';
import Button from 'core/components/Button';

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
