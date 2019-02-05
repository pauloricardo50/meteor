// @flow
import React from 'react';
import { withState } from 'recompose';

import T from 'core/components/Translation';
import Button from 'core/components/Button';
import Icon from 'core/components/Icon';

type MobileWarningProps = {};

const MobileWarning = ({ showWarning, toggleWarning }: MobileWarningProps) => {
  if (!showWarning) {
    return null;
  }

  return (
    <div className="mobile-warning">
      <Icon type="phoneLink" size={80} />
      <h4 className="text-center title">
        <T id="MobileWarning.title" />
      </h4>
      <p className="text-center">
        <T id="MobileWarning.description" />
      </p>
      <Button primary onClick={() => toggleWarning(false)}>
        <T id="MobileWarning.buttonLabel" />
      </Button>
    </div>
  );
};

export default withState('showWarning', 'toggleWarning', true)(MobileWarning);
