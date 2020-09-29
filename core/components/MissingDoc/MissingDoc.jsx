import React, { Component } from 'react';
import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons/faQuestionCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from '../Button';
import Icon from '../Icon';
import Link from '../Link';
import Loading from '../Loading';
import T from '../Translation';

class MissingDoc extends Component {
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
      <div className="missing-doc flex-col center animated fadeIn">
        <FontAwesomeIcon icon={faQuestionCircle} className="icon" />

        <h2 className="font-size-4 secondary mb-16">
          <T id="MissingDoc.text" />
        </h2>
        <div className="flex center">
          <Link to="/" className="home-link">
            <Button raised color="secondary" icon={<Icon type="home" />}>
              <T id="MissingDoc.redirectHome" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}

export default MissingDoc;
