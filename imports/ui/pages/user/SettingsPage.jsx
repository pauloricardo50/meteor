import React from 'react';
import { DocHead } from 'meteor/kadira:dochead';

import Checkbox from 'material-ui/Checkbox';


const style = {
  h: {
    display: 'inline-block',
    marginRight: 5,
  },
  content: {
    paddingLeft: 20,
    paddingRight: 20,
  },
};


export default class SettingsPage extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Réglages - e-Potek');
  }

  render() {
    return (
      <section className="mask1">
        <h2>Réglages</h2>
        <hr />

        <div style={style.content}>
          <div className="form-group">
            <h4 style={style.h}>Adresse email</h4><a>Changer</a>
            <p className="secondary">{this.props.currentUser.emails[0].address}</p>
          </div>

          <div className="form-group">
            <h4 style={style.h}>Mot de passe</h4><a>Changer</a>
          </div>

          <div className="form-group">
            <h4 style={style.h}>Téléphone</h4><a>Changer</a>
            <p className="secondary">+41 78 709 31 31</p>
          </div>

          <div className="form-group">
            <h4 style={style.h}>Langue</h4><a>Changer</a>
            <p className="secondary">Français</p>
          </div>

          <div className="form-group">
            <h4>Recevoir des notifications quand mon dossier avance</h4>
            <Checkbox
              label="Par email"
            />
            <Checkbox
              label="Par SMS"
            />
          </div>
        </div>


        {/* <ul>
            <li><a href="/admin/users">{{_ "nav_admin_users"}}</a></li>
            <li><a href="/admin/requests">{{_ "nav_admin_requests"}}</a></li>
        </ul> */}
      </section>
    );
  }
}

SettingsPage.propTypes = {
  currentUser: React.PropTypes.objectOf(React.PropTypes.any),
};
