import PropTypes from 'prop-types';
import React, { Component } from 'react';
import cleanMethod from '/imports/api/cleanMethods';

import Button from '/imports/ui/components/general/Button';
import { Link } from 'react-router-dom';
import { LoadingComponent } from '/imports/ui/components/general/Loading';
import { isDemo } from '/imports/js/helpers/browserFunctions';
import ProcessPage from '/imports/ui/components/general/ProcessPage';
import ConfirmButton from '/imports/ui/components/general/ConfirmButton';
import { T } from '/imports/ui/components/general/Translation';
import track from '/imports/js/helpers/analytics';

export default class VerificationPage extends Component {
  handleClick = () => {
    if (isDemo()) {
      const object = {};
      object['logic.verification.validated'] = true;
      cleanMethod('updateRequest', object, this.props.loanRequest._id);
    } else {
      cleanMethod(
        'requestVerification',
        null,
        this.props.loanRequest._id,
      ).then(() => track('requested verification', {}));
    }
  };

  render() {
    let content = null;
    const verification = this.props.loanRequest.logic.verification;

    if (verification.validated === true) {
      content = (
        <div
          className="text-center animated fadeIn"
          style={{ margin: '40px 0' }}
        >
          <h1 className="success">
            <T id="VerificationPage.successTitle" />{' '}
            <span className="fa fa-check" />
          </h1>
          <p className="description">
            <T id="VerificationPage.successDescription" />
          </p>
        </div>
      );
    } else if (verification.validated === false) {
      content = (
        <div
          className="text-center animated fadeIn"
          style={{ margin: '40px 0' }}
        >
          <h1 className="warning">
            <T id="VerificationPage.failedTitle" />{' '}
            <span className="fa fa-times" />
          </h1>
          <div className="description">
            <p>
              <T id="VerificationPage.failedDescription" />
            </p>
          </div>
          <ul
            style={{ margin: '20px 0' }}
            className="verification-comment-list"
          >
            {verification.comments.length > 0 &&
              verification.comments
                .map((comment, i) => (
                  <li key={i}>
                    <h3>
                      {i + 1}. {comment}
                    </h3>
                  </li>
                ))
                .reduce((prev, curr) => [prev, <hr />, curr])}
          </ul>
          {verification.requested ? (
            <div style={{ height: 150 }} className="animated fadeIn">
              <LoadingComponent />
            </div>
          ) : (
            <div style={{ marginTop: 40 }}>
              <ConfirmButton
                raised
                label={<T id="VerificationPage.CTA2" />}
                primary
                handleClick={this.handleClick}
              />
            </div>
          )}
        </div>
      );
    } else {
      content = (
        <article>
          <div className="description">
            <p>
              <T id="VerificationPage.description" />
            </p>
          </div>
          {verification.requested ? (
            <div style={{ height: 150 }} className="animated fadeIn">
              <LoadingComponent />
            </div>
          ) : (
            <div
              className="text-center"
              style={{
                margin: '40px 0',
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                raised
                label={<T id="general.cancel" />}
                link
                to={`/app/requests/${this.props.loanRequest._id}`}
                style={{ marginRight: 8 }}
              />
              <ConfirmButton
                raised
                label={<T id="VerificationPage.CTA" />}
                primary
                handleClick={this.handleClick}
                text={<T id="VerificationPage.CTA.warning" />}
              />
            </div>
          )}
        </article>
      );
    }

    return (
      <ProcessPage
        {...this.props}
        stepNb={1}
        id="verification"
        showBottom={false}
      >
        <section className="mask1">{content}</section>
      </ProcessPage>
    );
  }
}

VerificationPage.propTypes = {
  loanRequest: PropTypes.objectOf(PropTypes.any).isRequired,
};
