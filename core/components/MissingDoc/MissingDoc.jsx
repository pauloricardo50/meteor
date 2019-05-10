import React, { Component } from 'react';

import Link from '../Link';
import T from '../Translation';
import Button from '../Button';
import Loading from '../Loading';

class MisisngDoc extends Component {
  constructor() {
    super();
    this.state = { render: false };
  }

  componentDidMount() {
    // Set a timeout to allow subscriptions to refetch data before
    // showing the missingdoc component
    // 500ms is chosen because it should catch most subscription refreshes
    // on regular connections
    setTimeout(() => {
      this.setState({ render: true });
    }, 500);
  }

  render() {
    const { render } = this.state;

    if (!render) {
      return <Loading />;
    }

    return (
      <div className="flex-col center animated jackInTheBox">
        <div className="description">
          <p>
            <T id="MissingDoc.text" />
          </p>
        </div>
        <div className="flex center">
          <Link to="/" className="home-link">
            <Button raised color="secondary">
              <T id="MissingDoc.redirectHome" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
export default MisisngDoc;
