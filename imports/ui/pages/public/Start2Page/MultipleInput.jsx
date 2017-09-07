import PropTypes from 'prop-types';
import React, { Component } from 'react';

import AutoTooltip from '/imports/ui/components/general/AutoTooltip';
import StartTextField from './StartTextField';

const styles = {
  borrowerH1: {
    marginTop: 32,
    marginBottom: 0,
    display: 'inline-block',
    width: '100%',
  },
  hr: {
    border: 'none',
    height: 1,
    color: 'black',
    backgroundColor: 'black',
    margin: 0,
    marginTop: 16,
  },
  h1: {
    marginBottom: 0,
  },
  textFieldH1: {
    marginTop: 0,
    marginBottom: 0,
    display: 'inline',
  },
};

export default class MultipleInput extends Component {
  handleClick() {
    const multiple = this.props.formState.borrowerCount > 1;
    this.props.setActiveLine(this.props.id);

    // Don't focus if multiple text fields
    if (this.props.money && !multiple) {
      this.firstInput.input.inputElement.focus();
    } else if (!multiple) {
      this.firstInput.focus();
    }
  }

  render() {
    const multiple = this.props.formState.borrowerCount > 1;
    let classes1 = 'fixed-size';
    let classes2 = 'fixed-size';

    if (multiple) {
      classes1 = 'col-xs-12 col-sm-5 fixed-size';
      classes2 = 'col-xs-12 col-sm-5 col-sm-offset-2 fixed-size';
    }

    const TitleTag = multiple ? 'h3' : 'h1';

    return (
      <article
        className={this.props.className.concat(multiple ? ' no-scale' : '')}
        onClick={this.handleClick.bind(this)}
      >

        {multiple &&
          this.props.firstMultiple &&
          <h1 style={styles.borrowerH1} className="fixed-size">
            <span className="col-xs-5">Emprunteur 1</span>
            <span className="col-xs-5 col-xs-offset-2">Emprunteur 2</span>
            <span className="col-xs-12"><hr style={styles.hr} /></span>
          </h1>}

        <TitleTag style={styles.h1} className="fixed-size">
          <AutoTooltip>{this.props.text1}</AutoTooltip>
        </TitleTag>

        <h1 className={classes1} style={styles.textFieldH1}>
          <span className="active">
            <StartTextField
              {...this.props}
              width={multiple ? '100%' : this.props.width}
              id={`${this.props.id}1`}
              setRef={c => {
                this.firstInput = c;
              }}
              multiple={multiple}
            />
          </span>
        </h1>

        {multiple &&
          <h1 className={classes2} style={styles.textFieldH1}>
            <span className="active">
              <StartTextField
                {...this.props}
                width="100%"
                id={`${this.props.id}2`}
                autoFocus={false}
              />
            </span>
          </h1>}

      </article>
    );
  }
}

MultipleInput.propTypes = {
  id: PropTypes.string.isRequired,
  text1: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  formState: PropTypes.objectOf(PropTypes.any),
  firstMultiple: PropTypes.bool,
  className: PropTypes.string.isRequired,
  setActiveLine: PropTypes.func.isRequired,
};

MultipleInput.defaultProps = {
  firstMultiple: false,
  width: '',
  formState: {},
};
