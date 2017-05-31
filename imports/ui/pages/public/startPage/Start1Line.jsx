import PropTypes from 'prop-types';
import React from 'react';
import { Motion, spring, presets } from 'react-motion';

import AutoTooltip from '/imports/ui/components/general/AutoTooltip.jsx';
import Start1Text from './Start1Text.jsx';
import Start1Slider from './Start1Slider.jsx';
import { T } from '/imports/ui/components/general/Translation.jsx';

const Start1Line = props => (
  <Motion defaultStyle={{ x: 0 }} style={{ x: spring(props.value, presets.gentle) }}>
    {value => (
      <article className="oscar-line">
        <label htmlFor="">
          {/* use props.name as a for tag, not done here to allow tooltips to be clicked*/}
          <T id={props.label} tooltipPlacement="right" />
          {' '}
          {props.isReady && <span className={props.labelIcon} />}
        </label>
        <Start1Text {...props} motionValue={value.x} />
        <Start1Slider {...props} motionValue={value.x} />
      </article>
    )}
  </Motion>
);

Start1Line.propTypes = {
  value: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  labelIcon: PropTypes.string.isRequired,
  isReady: PropTypes.bool.isRequired,
};

export default Start1Line;
