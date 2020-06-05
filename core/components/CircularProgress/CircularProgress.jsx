import React from 'react';
import MuiCircularProgress from '@material-ui/core/CircularProgress';

import colors from '../../config/colors';

const circularProgressProps = {
  variant: 'static',
  thickness: 6,
};

const CircularProgress = ({ percent, size = '1em' }) => (
  <div style={{ width: size, height: size }}>
    <MuiCircularProgress
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        color: colors.borderGrey,
      }}
      value={100}
      size={size}
      {...circularProgressProps}
    />
    <MuiCircularProgress
      // style={{ margin: '0 2px' }}
      value={percent * 100}
      color={percent >= 1 ? 'secondary' : 'primary'}
      size={size}
      {...circularProgressProps}
    />
  </div>
);

export default CircularProgress;
