import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classnames from 'classnames';
import StartTextField from './StartTextField';

const styles = {
  hr: {
    width: '100%',
    margin: 0,
    marginTop: 16,
  },
  h1: {
    marginBottom: 0,
  },
  textFieldH1: {
    marginTop: 0,
    marginBottom: 0,
    display: 'flex',
  },
};

export default class MultipleInput extends Component {
  handleClick = () => {
    const multiple = this.props.formState.borrowerCount > 1;
    this.props.setActiveLine(this.props.id);

    // Don't focus if multiple text fields
    if (this.props.money && !multiple) {
      this.firstInput.input.inputElement.focus();
    } else if (!multiple) {
      this.firstInput.focus();
    }
  };

  render() {
    const {
      formState,
      className,
      firstMultiple,
      text1,
      width,
      id,
    } = this.props;
    const multiple = formState.borrowerCount > 1;
    let classes1 = 'fixed-size';
    let classes2 = 'fixed-size';

    if (multiple) {
      classes1 = 'col-xs-12 col-sm-5 fixed-size input1';
      classes2 = 'col-xs-12 col-sm-5 col-sm-offset-2 fixed-size input2';
    }

    const TitleTag = multiple ? 'h3' : 'h1';

    return (
      <article
        className={classnames({
          [className]: true,
          'no-scale multiple-input': multiple,
        })}
        onClick={this.handleClick}
      >
        {multiple &&
          firstMultiple && (
            <h1 className="fixed-size multiple-header ">
              <div>
                <span>Emprunteur 1</span>
                <span>Emprunteur 2</span>
              </div>
              <hr style={styles.hr} />
            </h1>
          )}

        <TitleTag style={styles.h1} className="fixed-size">
          {text1}
        </TitleTag>

        <div className="inputs">
          <h1 className={classes1}>
            <span className="active">
              <StartTextField
                {...this.props}
                width={multiple ? '100%' : width}
                id={`${id}1`}
                setRef={(c) => {
                  this.firstInput = c;
                }}
                noDelete={multiple}
              />
            </span>
          </h1>

          {multiple && (
            <h1 className={classes2}>
              <span className="active">
                <StartTextField
                  {...this.props}
                  width="100%"
                  id={`${id}2`}
                  autoFocus={false}
                  noDelete
                />
              </span>
            </h1>
          )}
        </div>
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
