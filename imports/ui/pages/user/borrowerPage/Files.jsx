import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';
import { mandatoryFilesPercent } from '/imports/js/arrays/steps';
import { getBorrowerMandatoryFiles, getBorrowerOptionalFiles } from '/imports/js/arrays/FileArrays';
import RadioInput from '/imports/ui/components/autoform/RadioInput.jsx';

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
    const percent = mandatoryFilesPercent([this.props.borrower]);

    return (
      <section className="animated fadeIn" key={this.props.borrower._id} style={styles.section}>
        <hr />
        <h2 className="text-center">
          Mes Documents
          <br />
          <small className={percent >= 1 && 'success'}>
            Progrès: {Math.round(percent * 1000) / 10}%
            {' '}
            {percent >= 1 && <span className="fa fa-check" />}
          </small>
        </h2>

        <div className="description">
          <p>
            <div className="text-center">
              <span className="fa fa-lock fa-3x" />
            </div>
            <br />
            Voici l'endroit où vous pouvez uploader vos document en toute confidentialité. Votre conseiller attitré
            {' '}
            <Link to="/app/contact" className="active">Yannis</Link>
            {' '}
            est le seul à y avoir accès.
          </p>
        </div>

        <h3 className="text-center">Documents obligatoires</h3>

        <div style={styles.radioDiv}>
          <RadioInput
            id="hasChangedSalary"
            label="Est-ce que votre salaire est différent de votre dernière déclaration fiscale?"
            options={[{ id: true, label: 'Oui' }, { id: false, label: 'Non' }]}
            currentValue={this.props.borrower.hasChangedSalary}
            documentId={this.props.borrower._id}
            updateFunc="updateBorrower"
          />
        </div>

        <DropzoneArray
          array={getBorrowerMandatoryFiles(this.props.borrower)}
          documentId={this.props.borrower._id}
          pushFunc="pushBorrowerValue"
          collection="borrowers"
          filesObject={this.props.borrower.files}
          filesObjectSelector="files"
        />

        <h3 className="text-center">Documents nécéssaires par la suite</h3>

        <div className="description">
          <p>
            Nous aurons besoin des documents ci-dessous pour aller au bout de la demande de prêt. Pour l'instant ils ne sont pas nécéssaires.
          </p>
        </div>

        <DropzoneArray
          array={getBorrowerOptionalFiles(this.props.borrower)}
          documentId={this.props.borrower._id}
          pushFunc="pushBorrowerValue"
          collection="borrowers"
          filesObject={this.props.borrower.files}
          filesObjectSelector="files"
        />

      </section>
    );
  }
}

Files.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};
