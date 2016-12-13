import React, { Component, PropTypes } from 'react';
import { DocHead } from 'meteor/kadira:dochead';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';


import RequestSelector from '/imports/ui/components/general/RequestSelector.jsx';


const styles = {
  section: {
    position: 'relative',
  },
  h: {
    display: 'inline-block',
    marginRight: 5,
  },
  div: {
    paddingLeft: 20,
    paddingRight: 20,
  },
  mobileLogoutButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
};


export default class SettingsPage extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    DocHead.setTitle('Réglages - e-Potek');
  }

  render() {
    return (
      <section className="mask1 animated fadeIn" style={styles.section}>
        <h2>Réglages</h2>
        <span className="hidden-sm hidden-md hidden-lg" style={styles.mobileLogoutButton}>
          <RaisedButton
            label="Déconnexion"
            onClick={() => Meteor.logout(() => FlowRouter.go('/'))}
          />
        </span>
        <hr />

        <div style={styles.div}>
          <div className="form-group">
            <h4 style={styles.h}>Adresse email</h4><a>Changer</a>
            <br />
            <p className="secondary">{this.props.currentUser.emails[0].address}</p>
          </div>

          <div className="form-group">
            <h4 style={styles.h}>Mot de passe</h4><a>Changer</a>
          </div>

          <div className="form-group">
            <h4 style={styles.h}>Téléphone</h4><a>Changer</a>
            <br />
            <p className="secondary">+41 78 709 31 31</p>
          </div>

          <div className="form-group">
            <h4 style={styles.h}>Langue</h4><a>Changer</a>
            <br />
            <p className="secondary">Français</p>
          </div>

          <div className="form-group">
            <h4>Recevoir des notifications quand mon dossier avance</h4>
            <br />
            <Checkbox
              label="Par email"
            />
            <Checkbox
              label="Par SMS"
            />
          </div>

          <div className="form-group">
            <RequestSelector creditRequests={this.props.creditRequests} />
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
  currentUser: PropTypes.objectOf(PropTypes.any),
  creditRequests: PropTypes.arrayOf(PropTypes.object),
};
