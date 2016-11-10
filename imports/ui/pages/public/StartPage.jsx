import React, { Component } from 'react';
import { DocHead } from 'meteor/kadira:dochead';


const styles = {
  section: {
    display: 'table',
    height: '100%',
    width: '100%',
  },
  article: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
};


export default class StartPage extends Component {
  componentDidMount() {
    DocHead.setTitle('e-Potek');

    this.state = {
      step: 0,
    };
  }


  render() {
    return (
      <section style={styles.section}>
        <article style={styles.article}>
          <h1>Hello!!!! What the fuck??</h1>
        </article>
      </section>
    );
  }
}
