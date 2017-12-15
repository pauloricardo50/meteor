import React from 'react';
import { Accounts, STATES } from 'meteor/std:accounts-ui'; // TODO: back to normal once std:accounts-ui is fixed
import {
  // RaisedButton,
  // FlatButton,
  FontIcon,
  TextField,
  // Divider,
  Snackbar,
} from 'material-ui';

import MuiButton from 'core/components/Button';

class LoginForm extends Accounts.ui.LoginForm {
  componentWillMount() {
    // FIXME hack to solve issue #18
  }
}

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
        ref={ref => (this.form = ref)}
        className={['accounts', className].join(' ')}
      >
        {Object.keys(fields).length > 0 ? (
          <Accounts.ui.Fields fields={fields} />
        ) : null}
        <Accounts.ui.Buttons buttons={buttons} />
        <br />
        {formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
          <div className="or-sep">
            <Accounts.ui.PasswordOrService oauthServices={oauthServices} />
          </div>
        ) : null}
        {formState == STATES.SIGN_IN || formState == STATES.SIGN_UP ? (
          <Accounts.ui.SocialButtons oauthServices={oauthServices} />
        ) : null}
        <br />
        <Accounts.ui.FormMessage {...message} />
      </form>
    );
  }
}

class Buttons extends Accounts.ui.Buttons {}

class Button extends Accounts.ui.Button {
  render() {
    const {
      label,
      href = null,
      type,
      disabled = false,
      onClick,
      className,
      icon,
    } = this.props;
    return type == 'link' ? (
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
      <div className={[className].join(' ')}>
        {Object.keys(fields).map((id, i) => (
          <div key={i}>
            <Accounts.ui.Field {...fields[id]} />
            <br />
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
      className,
      defaultValue = '',
    } = this.props;
    const { mount = true } = this.state;
    return mount ? (
      <TextField
        label={label}
        placeholder={hint}
        onChange={onChange}
        fullWidth
        defaultValue={defaultValue}
        name={id}
        type={type}
        ref={ref => (this.input = ref)}
        required={required ? 'required' : ''}
        autoCapitalize={type == 'email' ? 'none' : false}
        autoCorrect="off"
        shrink
      />
    ) : null;
  }
}
// class SocialButtons extends Accounts.ui.SocialButtons {
//   render() {
//     const { oauthServices = {}, className = 'social-buttons' } = this.props;
//     if (Object.keys(oauthServices).length > 0) {
//       return (
//         <div className={[className].join(' ')}>
//           {Object.keys(oauthServices).map((id, i) => {
//             const serviceClass = id.replace(
//               /google|meteor\-developer/gi,
//               matched => socialButtonIcons[matched],
//             );
//             const { label, type, onClick, disabled } = oauthServices[id];
//             return (
//               <RaisedButton
//                 key={i}
//                 label={label}
//                 type={type}
//                 onTouchTap={onClick}
//                 disabled={disabled}
//                 className={serviceClass.length > 0 ? `${serviceClass}` : ''}
//                 icon={
//                   serviceClass.length > 0 ? (
//                     <FontIcon className={`fa fa-${serviceClass}`} />
//                   ) : (
//                     ''
//                   )
//                 }
//                 backgroundColor={socialButtonsColors[id].background}
//                 labelColor={socialButtonsColors[id].label}
//                 style={{ marginRight: '5px' }}
//               />
//             );
//           })}
//         </div>
//       );
//     }
//     return null;
//   }
// }

class FormMessage extends Accounts.ui.FormMessage {
  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.message) {
      this.setState({ open: true });
    }
  }

  handleRequestClose = () => this.setState({ open: false });

  render() {
    const { message, type } = this.props;
    // let bodyStyle;
    // switch (type) {
    //   case 'warning':
    //     bodyStyle = {
    //       backgroundColor: yellow600,
    //     };
    //     break;
    //   case 'success':
    //     bodyStyle = {
    //       backgroundColor: green500,
    //     };
    //     break;
    //   case 'error':
    //     bodyStyle = {
    //       backgroundColor: red500,
    //     };
    //     break;
    //   case 'info':
    //     bodyStyle = {
    //       backgroundColor: lightBlue600,
    //     };
    //     break;
    //   default:
    //     break;
    // }

    return message ? (
      <Snackbar
        open={this.state.open}
        message={message}
        // bodyStyle={bodyStyle}
        action="OK"
        autoHideDuration={4000}
        onActionTouchTap={this.handleRequestClose}
        onRequestClose={this.handleRequestClose}
      />
    ) : null;
  }
}

// Notice! Accounts.ui.LoginForm manages all state logic at the moment, so avoid overwriting this
// one, but have a look at it and learn how it works. And pull requests altering how that works are
// welcome. Alter provided default unstyled UI.
Accounts.ui.LoginForm = LoginForm;
Accounts.ui.Form = Form;
Accounts.ui.Buttons = Buttons;
Accounts.ui.Button = Button;
Accounts.ui.Fields = Fields;
Accounts.ui.Field = Field;
Accounts.ui.FormMessage = FormMessage;
// Accounts.ui.SocialButtons = SocialButtons;

// Export the themed version.
export { STATES };
export default Accounts;
