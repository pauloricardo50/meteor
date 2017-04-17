import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import DropzoneArray from '/imports/ui/components/general/DropzoneArray.jsx';
import { filesPercent } from '/imports/js/arrays/steps';

export const getFileArray = borrower => [
  {
    title: '3 Fiches de salaire',
    folderName: 'buyersContract',
    currentValue: borrower.files.lastSalaries,
    id: 'files.lastSalaries',
  },
  {
    title: "Pièce d'identité",
    folderName: 'identity',
    currentValue: borrower.files.identity,
    id: 'files.identity',
  },
  {
    title: "Déclaration d'impôts (dev)",
    files: 3,
    done: false,
  },
  {
    title: "Extrait de l'office des poursuites (dev)",
    files: 1,
    done: false,
  },
];

export default class Files extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: -1,
    };
  }

  render() {
    const percent = filesPercent([this.props.borrower]);

    return (
      <section className="animated fadeIn">
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

        <DropzoneArray
          array={getFileArray(this.props.borrower)}
          documentId={this.props.borrower._id}
          pushFunc="pushBorrowerValue"
          collection="borrowers"
        />

      </section>
    );
  }
}

Files.propTypes = {
  borrower: PropTypes.objectOf(PropTypes.any).isRequired,
};
