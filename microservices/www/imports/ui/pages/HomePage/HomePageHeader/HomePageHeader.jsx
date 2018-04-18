import React from 'react';
import { withRouter } from 'react-router';

import { T } from 'core/components/Translation';
import Waves from '../../../components/Waves';
import Widget1SingleInputForm from '../../Widget1Page/Widget1SingleInputForm';
import { SALARY } from '../../Widget1Page/Widget1Page';

const HomePageHeader = ({ history }) => (
  <header>
    <Waves noSlope={false} transparent />
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
    <Widget1SingleInputForm
      name={SALARY}
      onClick={() => history.push('/start/1')}
    />
  </header>
);

export default withRouter(HomePageHeader);
