import React from 'react';
import PropTypes from 'prop-types';
import { PersistGate } from 'redux-persist/integration/react';

import Loading from 'core/components/Loading/Loading';
import Widget1SingleInput from '../Widget1SingleInput';
import Widget1SingleInputFormContainer from './Widget1SingleInputFormContainer';
import Widget1SingleInputFormButtons from './Widget1SingleInputFormButtons';
import { persistor } from '../../../../startup/shared/setupStore';

const Widget1SingleInputForm = ({
  name,
  onSubmit,
  isCurrentStep,
  onDoNotKnow,
  disableSubmit,
}) => (
  <div
    id={`widget1-${name}`}
    duration={200}
    className="widget1-single-input-form card1 animated fadeInUp"
  >
    <PersistGate persistor={persistor} loading={<Loading />}>
      <form onSubmit={onSubmit}>
        <Widget1SingleInput name={name} />
        {isCurrentStep && (
          <Widget1SingleInputFormButtons
            disableSubmit={disableSubmit}
            onDoNotKnow={onDoNotKnow}
          />
        )}
      </form>
    </PersistGate>
  </div>
);

Widget1SingleInputForm.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDoNotKnow: PropTypes.func.isRequired,
  isCurrentStep: PropTypes.bool,
  disableSubmit: PropTypes.bool.isRequired,
};

Widget1SingleInputForm.defaultProps = {
  isCurrentStep: true,
};

export default Widget1SingleInputFormContainer(Widget1SingleInputForm);
