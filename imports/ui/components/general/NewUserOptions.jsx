import React, { Component, PropTypes } from 'react';

import RaisedButton from 'material-ui/RaisedButton';

const options = [
  {
    icon: 'fa fa-home',
    title: 'J\'ai trouvé la propriété que je veux et contacté le vendeur',
    href: '/start',
  }, {
    icon: 'fa fa-search',
    title: 'Je n\'ai pas encore vu mon bonheur',
    href: '',
  }, {
    icon: 'fa fa-money',
    title: 'Je veux refinancer un prêt existant',
    href: '',
  }, {
    icon: 'fa fa-calculator',
    title: 'Je veux juste utiliser votre calculatrice incroyable',
    href: '',
  },
];

const styles = {
  button: {
    position: 'absolute',
    bottom: 20,
  },
  h1: {
    paddingBottom: 20,
  },
};


export default class NewUserOptions extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="container-fluid">
        <h1 style={styles.h1} >Où en êtes-vous?</h1>
        {options.map((option, index) => (
          <article className="col-md-6 form-group" key={index}>
            <a className="col-md-12 mask2 newUserOption" href={option.href}>
              <span className={option.icon} />
              <h4>{option.title}</h4>
            </a>
          </article>
        ))}
      </div>
    );
  }
}

NewUserOptions.propTypes = {};
