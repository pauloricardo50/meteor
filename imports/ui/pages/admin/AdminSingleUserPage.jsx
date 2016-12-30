import React, {PropTypes} from 'react';


export default class AdminSingleUserPage extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <section className="mask1">
        <h1>{this.props.user.emails[0].address}</h1>
      </section>
    );
  }
}

AdminSingleUserPage.propTypes = {
  creditRequests: PropTypes.arrayOf(PropTypes.any).isRequired,
  user: PropTypes.objectOf(PropTypes.any).isRequired,
};
