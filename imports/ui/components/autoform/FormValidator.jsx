import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

import cleanMethod from '/imports/api/cleanMethods';

import Checkbox from 'material-ui/Checkbox';

const handleCheck = (props, isInputChecked) => {
  const object = {};
  object[`adminValidation.${props.id}`] = isInputChecked;
  cleanMethod(props.updateFunc, object, props.documentId);
};

const styles = {
  div: {
    position: 'absolute',
    top: '50%',
    right: '0px',
  },
  wrapper: {
    position: 'relative',
    right: '-100%',
  },
};

export default class FormValidator extends Component {
  render() {
    if (!this.props.admin) {
      return null;
    }

    const checked = !!get(this.props.doc.adminValidation, this.props.id);
    return (
      <div style={styles.div}>
        <div style={styles.wrapper}>
          <Checkbox
            label={checked ? 'Validé' : 'Valider'}
            checked={checked}
            onCheck={(e, c) => handleCheck(this.props, c)}
          />
        </div>
      </div>
    );
  }
}

FormValidator.propTypes = {};
