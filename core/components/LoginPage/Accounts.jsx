import React from 'react';
import { Accounts, STATES } from 'meteor/epotek:accounts-ui';
import Snackbar from '@material-ui/core/Snackbar';
import cx from 'classnames';

import TextField from '../Material/TextField';
import MuiButton from '../Button';

const { LoginForm } = Accounts.ui;

class Form extends Accounts.ui.Form {
  render() {
    const {
      hasPasswordService,
      oauthServices,
      fields,
      buttons,
      error,
      message,
      ready = true,
      className,
      formState,
    } = this.props;
    return (
      <form
        ref={ref => {
          this.form = ref;
        }}
        className={['accounts', 'login-input', className].join(' ')}
      >
        {Object.keys(fields).length > 0 ? (
          <Accounts.ui.Fields fields={fields} />
        ) : null}
        <Accounts.ui.Buttons buttons={buttons} />
        <br />
        {formState === STATES.SIGN_IN || formState === STATES.SIGN_UP ? (
          <div className="or-sep">
            <Accounts.ui.PasswordOrService oauthServices={oauthServices} />
          </div>
        ) : null}
        {formState === STATES.SIGN_IN || formState === STATES.SIGN_UP ? (
          <Accounts.ui.SocialButtons oauthServices={oauthServices} />
        ) : null}
        <br />
        <Accounts.ui.FormMessage {...message} />
      </form>
    );
  }
}
console.log('3');

class Buttons extends Accounts.ui.Buttons {}

class Button extends Accounts.ui.Button {
  render() {
    const {
      id,
      label,
      href = null,
      type,
      disabled = false,
      onClick,
      className,
      icon,
    } = this.props;

    const switchToSignUp = id === 'switchToSignUp';

    // Disable signups here
    if (switchToSignUp) {
      return null;
    }

    return type === 'link' ? (
      <MuiButton
        href={href}
        label={label}
        icon={icon ? <span className={`fa ${icon}`} /> : null}
        className={className}
        onClick={onClick}
        disabled={disabled}
        style={{ marginRight: 5, marginTop: 8 }}
      />
    ) : (
      <MuiButton
        raised
        label={label}
        icon={icon ? <span className={`fa ${icon}`} /> : null}
        primary
        type={type}
        className={className}
        onClick={onClick}
        disabled={disabled}
        style={{ marginRight: 5, marginTop: 8 }}
      />
    );
  }
}
class Fields extends Accounts.ui.Fields {
  render() {
    const { fields = {}, className = '' } = this.props;
    return (
      <div className={cx(className, 'login-fields')}>
        {Object.keys(fields).map(id => (
          <div className="login-field" key={id}>
            <Accounts.ui.Field {...fields[id]} />
          </div>
        ))}
      </div>
    );
  }
}

class Field extends Accounts.ui.Field {
  render() {
    const {
      id,
      hint,
      label,
      type = 'text',
      onChange,
      required = false,
      defaultValue = '',
      message,
    } = this.props;
    const { mount = true } = this.state;

    return mount ? (
      <span className="login-field">
        <TextField
          variant="outlined"
          label={label}
          placeholder={hint}
          onChange={onChange}
          fullWidth
          defaultValue={defaultValue}
          name={id}
          type={type}
          required={required}
          autoCorrect="off"
        />
        {message && (
          <span className={['message', message.type].join(' ').trim()}>
            {message.message}
          </span>
        )}
      </span>
    ) : null;
  }
}

class FormMessage extends Accounts.ui.FormMessage {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      this.setState({ open: true });
    }
  }

  handleLoanClose = () => this.setState({ open: false });

  render() {
    const { message } = this.props;

    if (!message) {
      return null;
    }
    return (
      <Snackbar
        open={this.state.open}
        message={message}
        action="OK"
        autoHideDuration={4000}
        onActionTouchTap={this.handleLoanClose}
        onClose={this.handleLoanClose}
      />
    );
  }
}

// Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid overwriting this
// one, but have a look at it and learn how it works. And pull loans altering how that works are
// welcome. Alter provided default unstyled UI.
Accounts.ui.LoginForm = LoginForm;
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.FormMessage = FormMessage;

// Export the themed version.
export { STATES };
export default Accounts;
