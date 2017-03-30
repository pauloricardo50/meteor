import React, { PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

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

const ProfilePage = props => (
  <section className="mask1" style={styles.section}>
    <h1>Mon Profil</h1>
    <hr />

    <span
      className="hidden-sm hidden-md hidden-lg"
      style={styles.mobileLogoutButton}
    >
      <RaisedButton
        label="Déconnexion"
        onTouchTap={() => Meteor.logout(() => props.history.push('/home'))}
      />
    </span>

    <div style={styles.div}>
      <div className="form-group">
        <h4 style={styles.h}>Adresse email</h4><a>Changer</a>
        <br />
        <p className="secondary">
          {props.currentUser.emails[0].address}
        </p>
      </div>

      <div className="form-group">
        <h4 style={styles.h}>Mot de passe</h4><a>Changer</a>
      </div>

      <div className="form-group">
        <h4 style={styles.h}>Téléphone</h4><a>Changer</a>
        <br />
        <p className="secondary">+41 78 000 00 00</p>
      </div>

      <div className="form-group">
        <h4 style={styles.h}>Langue</h4><a>Changer</a>
        <br />
        <p className="secondary">Français</p>
      </div>

      <div className="form-group">
        <h4>Recevoir des notifications quand mon dossier avance</h4>
        <Checkbox label="Par email" style={{ zIndex: 1 }} />
        <Checkbox label="Par SMS" style={{ zIndex: 1 }} />
      </div>
    </div>

  </section>
);

ProfilePage.propTypes = {
  currentUser: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default ProfilePage;
