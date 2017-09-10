import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import DropzoneArray from '/imports/ui/components/general/DropzoneArray';
import { filesPercent } from '/imports/js/arrays/steps';
import { borrowerFiles } from '/imports/js/arrays/files';
import RadioInput from '/imports/ui/components/general/AutoForm/RadioInput';
import { T } from '/imports/ui/components/general/Translation';
import { disableForms } from '/imports/js/helpers/requestFunctions';

const styles = {
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  radioDiv: {
    alignSelf: 'center',
    margin: '20px 0',
  },
};

export default class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };
  }

  render() {
    // const percent = auctionFilesPercent([this.props.borrower]);
    const percent = filesPercent(
      [this.props.borrower],
      borrowerFiles,
      'auction',
    );

    // console.log(percent, percent2);

    return (
      <section
        className="animated fadeIn"
        key={this.props.borrower._id}
        style={styles.section}
      >
        <hr />
        <h2 className="text-center">
          <T id="Files.title" />
          <br />
          <small className={percent >= 1 && 'success'}>
            <T id="general.progress" values={{ value: percent }} />{' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </small>
        </h2>

        <div className="description">
          <p>
            <T id="Files.description" />
          </p>
        </div>

        <h3 className="text-center">
          <T id="Files.files1.title" />
        </h3>

        <div style={styles.radioDiv}>
          <RadioInput
            id="hasChangedSalary"
            label={<T id="Files.hasChangedSalary" />}
            options={[
              { id: true, label: <T id="general.yes" /> },
              { id: false, label: <T id="general.no" /> },
            ]}
            currentValue={this.props.borrower.hasChangedSalary}
            documentId={this.props.borrower._id}
            updateFunc="updateBorrower"
            disabled={disableForms(this.props.loanRequest)}
          />
        </div>

        <DropzoneArray
          array={borrowerFiles(this.props.borrower).auction}
          documentId={this.props.borrower._id}
          pushFunc="pushBorrowerValue"
          updateFunc="updateBorrower"
          collection="borrowers"
          filesObject={this.props.borrower.files}
          filesObjectSelector="files"
          disabled={disableForms(this.props.loanRequest)}
        />
      </section>
    );
  }
}

Files.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};
