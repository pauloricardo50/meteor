import React, { PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const options = [
  {
    icon: 'fa fa-home',
    title: 'J\'ai trouvé la propriété que je veux et contacté le vendeur',
    button: 'Commencer',
    href: '/new',
  }, {
    icon: 'fa fa-search',
    title: 'Je n\'ai pas encore vu mon bonheur',
    button: 'Chercher',
    href: '',
  }, {
    icon: 'fa fa-money',
    title: 'Je veux refinancer un prêt existant',
    button: 'C\'est Parti',
    href: '',
  }, {
    icon: 'fa fa-calculator',
    title: 'Je veux juste utiliser votre calculatrice incroyable',
    button: 'Pas de Problème',
    href: '',
  },
];

const styles = {
  button: {
    position: 'absolute',
    bottom: 20,
  },
};


export default class NewUserOptions extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="container-fluid">
        {options.map((option, index) => (
          <article className="col-md-6 form-group" key={index}>
            <div className="col-md-12 mask1 newUserOption">
              <span className={option.icon} />
              <h4>{option.title}</h4>
              <RaisedButton label={option.button} href={option.href} primary style={styles.button} />
            </div>
          </article>
        ))}
      </div>
    );
  }
}

NewUserOptions.propTypes = {};
