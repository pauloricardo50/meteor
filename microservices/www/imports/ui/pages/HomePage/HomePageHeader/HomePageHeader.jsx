import React from 'react';

import { T } from 'core/components/Translation';
import Waves from '../../../components/Waves';
import { Widget1Starter } from '../../../components/Widget1';

const HomePageHeader = () => (
  <header>
    <Waves noSlope={false} />
    <div className="text">
      <b>
        <h1>
          <T id="HomePageHeader.title" />
        </h1>
      </b>
      <span className="separator" />
      <h3>
        <T id="HomePageHeader.description" />
      </h3>
    </div>
    <Widget1Starter link="/start/1" />
  </header>
);

export default HomePageHeader;
