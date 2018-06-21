import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import T from 'core/components/Translation';
import {
  TooltipProvider,
  TOOLTIP_LISTS,
} from 'core/components/tooltips/TooltipContext';
import { widget1Constants } from '../../../../redux/widget1';
import Waves from '../../../components/Waves';
import Widget1SingleInputForm from '../../Widget1Page/Widget1SingleInputForm';

const HomePageHeader = ({ history }) => (
  <header>
    <div className="text">
      <b>
        <h1>
          <T id="HomePageHeader.title" />
        </h1>
      </b>
      <span className="separator" />
      <h4>
        <T id="HomePageHeader.description" />
      </h4>
    </div>
    <Waves noSlope={false} />
    <TooltipProvider tooltipList={TOOLTIP_LISTS.WIDGET1}>
      <Widget1SingleInputForm
        name={widget1Constants.PROPERTY}
        onClick={() => history.push('/start/1')}
      />
    </TooltipProvider>
  </header>
);

HomePageHeader.propTypes = {
  history: PropTypes.object.isRequired,
};

export default withRouter(HomePageHeader);
