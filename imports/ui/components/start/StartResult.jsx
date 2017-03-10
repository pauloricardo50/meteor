import React, {PropTypes} from 'react';

export default class StartResult extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <article className="mask1 start-result">
        <h1>Résultat: <span className="success">Excellent</span></h1>
      </article>
    );
  }
}

StartResult.propTypes = {
};
