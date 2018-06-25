import React from 'react';
import './Button.jsx';
import { Accounts } from 'meteor/accounts-base';

export class SocialButtons extends React.Component {
  render() {
    const { oauthServices = {}, className = 'social-buttons' } = this.props;
    return (
      <div className={className}>
        {Object.keys(oauthServices).map((id, i) => (
          <Accounts.ui.Button {...oauthServices[id]} key={i} />
        ))}
      </div>
    );
  }
}

Accounts.ui.SocialButtons = SocialButtons;
